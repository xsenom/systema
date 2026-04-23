from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.models import (
    User,
    Profile,
    BlogLink,
    Recommendation,
    QuestItem,
    WorldNode,
    TrendSignal,
    Notification,
)
from app.schemas.schemas import (
    ProfileCreate,
    BlogLinksCreate,
    LegalAcceptIn,
    PaymentIn,
    WalletConsentIn,
    DashboardOut,
    RecommendationOut,
    QuestOut,
    WorldNodeOut,
    TrendOut,
    NotificationOut,
)
from app.services.analyzer import (
    generate_recommendations,
    generate_quests,
    generate_world_nodes,
    generate_trends,
)

router = APIRouter()


def get_or_create_user(db: Session, email: str) -> User:
    user = db.query(User).filter(User.email == email).first()
    if user:
        return user
    user = User(email=email, password_hash="demo_hash")
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def clear_generated_data(db: Session, user_id: int) -> None:
    db.query(Recommendation).filter(Recommendation.user_id == user_id).delete()
    db.query(QuestItem).filter(QuestItem.user_id == user_id).delete()
    db.query(WorldNode).filter(WorldNode.user_id == user_id).delete()
    db.query(TrendSignal).filter(TrendSignal.user_id == user_id).delete()
    db.commit()


def _notification_channels(db: Session, user_id: int) -> list[str]:
    channels = ["site", "email"]
    wallet_enabled = (
        db.query(Notification)
        .filter(Notification.user_id == user_id, Notification.channel == "wallet")
        .first()
    )
    if wallet_enabled:
        channels.append("wallet")
    return channels


def generate_all_for_user(db: Session, user: User, profile: Profile) -> None:
    clear_generated_data(db, user.id)
    blog_links = db.query(BlogLink).filter(BlogLink.user_id == user.id).all()
    serialized_links = [{"platform": x.platform, "url": x.url} for x in blog_links]

    for item in generate_recommendations(
        profile.niche,
        profile.has_blog,
        profile.current_stage,
        blog_links=serialized_links,
    ):
        db.add(Recommendation(user_id=user.id, **item))

    for item in generate_quests(profile.has_blog):
        db.add(QuestItem(user_id=user.id, **item))

    for item in generate_world_nodes():
        db.add(WorldNode(user_id=user.id, **item))

    for item in generate_trends(profile.niche, blog_links=serialized_links):
        db.add(TrendSignal(user_id=user.id, **item))

    for channel in _notification_channels(db, user.id):
        db.add(
            Notification(
                user_id=user.id,
                channel=channel,
                title="План на месяц собран",
                body="Система создала рекомендации, квесты, карту мира и тренды по блогу.",
            )
        )

    db.add(
        Notification(
            user_id=user.id,
            channel="site",
            title="Следующий шаг",
            body="Открой квесты и начни с первого действия.",
        )
    )

    db.commit()


@router.get("/health")
def health():
    return {"ok": True}


@router.post("/profile")
def create_profile(payload: ProfileCreate, db: Session = Depends(get_db)):
    user = get_or_create_user(db, payload.email)

    profile = db.query(Profile).filter(Profile.user_id == user.id).first()
    if profile:
        profile.name = payload.name
        profile.niche = payload.niche
        profile.description = payload.description
        profile.monthly_income_goal = payload.monthly_income_goal
        profile.current_stage = payload.current_stage
        profile.has_blog = payload.has_blog
        profile.blog_status = payload.blog_status
    else:
        profile = Profile(
            user_id=user.id,
            name=payload.name,
            niche=payload.niche,
            description=payload.description,
            monthly_income_goal=payload.monthly_income_goal,
            current_stage=payload.current_stage,
            has_blog=payload.has_blog,
            blog_status=payload.blog_status,
        )
        db.add(profile)

    db.commit()
    return {"ok": True, "email": payload.email}


@router.post("/blog-links")
def create_blog_links(payload: BlogLinksCreate, db: Session = Depends(get_db)):
    user = get_or_create_user(db, payload.email)

    db.query(BlogLink).filter(BlogLink.user_id == user.id).delete()
    for item in payload.links:
        if item.url.strip():
            db.add(BlogLink(user_id=user.id, platform=item.platform, url=item.url))

    db.commit()
    return {"ok": True}


@router.get("/blog-analysis/{email}")
def blog_analysis(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    profile = db.query(Profile).filter(Profile.user_id == user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Профиль не найден")

    links = db.query(BlogLink).filter(BlogLink.user_id == user.id).all()
    serialized_links = [{"platform": x.platform, "url": x.url} for x in links]

    return {
        "recommendations": generate_recommendations(
            profile.niche,
            profile.has_blog,
            profile.current_stage,
            blog_links=serialized_links,
        )[:3],
        "trends": generate_trends(profile.niche, blog_links=serialized_links)[:2],
    }


@router.post("/wallet-consent")
def wallet_consent(payload: WalletConsentIn, db: Session = Depends(get_db)):
    user = get_or_create_user(db, payload.email)

    if payload.enabled:
        db.add(
            Notification(
                user_id=user.id,
                channel="wallet",
                title="Wallet подключен",
                body="Подтверждено получение уведомлений в wallet.",
            )
        )
        db.commit()

    return {"ok": True, "enabled": payload.enabled}


@router.post("/legal")
def accept_legal(payload: LegalAcceptIn, db: Session = Depends(get_db)):
    if not (payload.accepted_policy and payload.accepted_offer and payload.accepted_personal_data):
        raise HTTPException(status_code=400, detail="Все согласия должны быть приняты")

    user = get_or_create_user(db, payload.email)
    db.add(
        Notification(
            user_id=user.id,
            channel="site",
            title="Согласия приняты",
            body="Политика, оферта и обработка данных подтверждены.",
        )
    )
    db.commit()
    return {"ok": True}


@router.post("/payment")
def create_payment(payload: PaymentIn, db: Session = Depends(get_db)):
    user = get_or_create_user(db, payload.email)
    db.add(
        Notification(
            user_id=user.id,
            channel="site",
            title="Оплата подтверждена",
            body=f"План {payload.plan_name} активирован.",
        )
    )
    db.commit()
    return {"ok": True, "status": payload.status}


@router.post("/generate/{email}")
def generate_plan(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    profile = db.query(Profile).filter(Profile.user_id == user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Профиль не найден")

    generate_all_for_user(db, user, profile)
    return {"ok": True}


@router.post("/seed-demo")
@router.post("/seed-mvp")
def seed_mvp(db: Session = Depends(get_db)):
    email = "mvp@sistema.local"
    user = get_or_create_user(db, email)

    profile = db.query(Profile).filter(Profile.user_id == user.id).first()
    if not profile:
        profile = Profile(
            user_id=user.id,
            name="Екатерина",
            niche="эксперт / наставник / digital-сервис",
            description="Помогаю специалистам упаковывать себя, выстраивать блог и путь к продаже через сервисы и контент.",
            monthly_income_goal=300000,
            current_stage="growth",
            has_blog=True,
            blog_status="active_blog",
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
    else:
        profile.name = "Екатерина"
        profile.niche = "эксперт / наставник / digital-сервис"
        profile.description = "Помогаю специалистам упаковывать себя, выстраивать блог и путь к продаже через сервисы и контент."
        profile.monthly_income_goal = 300000
        profile.current_stage = "growth"
        profile.has_blog = True
        profile.blog_status = "active_blog"
        db.commit()

    db.query(BlogLink).filter(BlogLink.user_id == user.id).delete()
    db.add(BlogLink(user_id=user.id, platform="telegram", url="https://t.me/mvp_blog"))
    db.add(BlogLink(user_id=user.id, platform="instagram", url="https://instagram.com/mvp_blog"))
    db.add(BlogLink(user_id=user.id, platform="website", url="https://example.com"))
    db.commit()

    generate_all_for_user(db, user, profile)
    return {"ok": True, "email": email}


@router.get("/dashboard/{email}", response_model=DashboardOut)
def get_dashboard(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    profile = db.query(Profile).filter(Profile.user_id == user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Профиль не найден")

    recs = db.query(Recommendation).filter(Recommendation.user_id == user.id).all()
    quests = db.query(QuestItem).filter(QuestItem.user_id == user.id).order_by(QuestItem.day_number.asc()).all()
    world_nodes = db.query(WorldNode).filter(WorldNode.user_id == user.id).order_by(WorldNode.sort_order.asc()).all()
    trends = db.query(TrendSignal).filter(TrendSignal.user_id == user.id).all()
    notifications = db.query(Notification).filter(Notification.user_id == user.id).order_by(Notification.id.desc()).all()

    return DashboardOut(
        email=user.email,
        profile_name=profile.name,
        niche=profile.niche,
        monthly_income_goal=profile.monthly_income_goal,
        current_stage=profile.current_stage,
        recommendations=[RecommendationOut(title=x.title, body=x.body) for x in recs],
        quests=[
            QuestOut(
                title=x.title,
                description=x.description,
                day_number=x.day_number,
                status=x.status,
                reward_points=x.reward_points,
            )
            for x in quests
        ],
        world_nodes=[
            WorldNodeOut(
                category=x.category,
                title=x.title,
                description=x.description,
                sort_order=x.sort_order,
                is_locked=x.is_locked,
            )
            for x in world_nodes
        ],
        trends=[
            TrendOut(
                niche=x.niche,
                title=x.title,
                summary=x.summary,
                implementation_tip=x.implementation_tip,
            )
            for x in trends
        ],
        notifications=[
            NotificationOut(title=x.title, body=x.body, channel=x.channel)
            for x in notifications
        ],
    )
