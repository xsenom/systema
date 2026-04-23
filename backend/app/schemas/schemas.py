from typing import List
from pydantic import BaseModel, EmailStr


class ProfileCreate(BaseModel):
    email: EmailStr
    name: str
    niche: str
    description: str
    monthly_income_goal: float = 0
    current_stage: str = "start"
    has_blog: bool = False
    blog_status: str = "no_blog"


class BlogLinkIn(BaseModel):
    platform: str
    url: str


class BlogLinksCreate(BaseModel):
    email: EmailStr
    links: List[BlogLinkIn]


class LegalAcceptIn(BaseModel):
    email: EmailStr
    accepted_policy: bool
    accepted_offer: bool
    accepted_personal_data: bool


class PaymentIn(BaseModel):
    email: EmailStr
    plan_name: str = "Sistema MVP"
    amount: float = 990
    status: str = "paid"


class RecommendationOut(BaseModel):
    title: str
    body: str


class QuestOut(BaseModel):
    title: str
    description: str
    day_number: int
    status: str
    reward_points: int


class WorldNodeOut(BaseModel):
    category: str
    title: str
    description: str
    sort_order: int
    is_locked: bool


class TrendOut(BaseModel):
    niche: str
    title: str
    summary: str
    implementation_tip: str


class NotificationOut(BaseModel):
    title: str
    body: str
    channel: str


class DashboardOut(BaseModel):
    email: str
    profile_name: str
    niche: str
    monthly_income_goal: float
    current_stage: str
    recommendations: List[RecommendationOut]
    quests: List[QuestOut]
    world_nodes: List[WorldNodeOut]
    trends: List[TrendOut]
    notifications: List[NotificationOut]