from typing import Dict, List


def _normalize_platforms(blog_links: List[Dict[str, str]]) -> List[str]:
    return [item.get("platform", "").strip().lower() for item in blog_links if item.get("url", "").strip()]


def generate_recommendations(
    niche: str,
    has_blog: bool,
    current_stage: str,
    blog_links: List[Dict[str, str]] | None = None,
) -> List[Dict]:
    blog_links = blog_links or []
    active_platforms = _normalize_platforms(blog_links)

    recs = [
        {
            "title": "Собрать понятный оффер",
            "body": "Один главный результат для клиента должен читаться за 5 секунд: в профиле, лендинге и в начале контента.",
        },
        {
            "title": "Сформулировать цель на 30 дней",
            "body": "Цель должна быть измеримой: заявки, консультации, продажи или охват в конкретных цифрах.",
        },
        {
            "title": "Сделать контент-матрицу",
            "body": "Раздели контент на 4 линии: экспертность, кейсы, личный стиль, продажа. Это уберёт хаос.",
        },
    ]

    if has_blog and active_platforms:
        recs.append(
            {
                "title": "Привязать блог к цели месяца",
                "body": f"Площадки ({', '.join(active_platforms)}) должны вести к одной CTA-цели недели и месяца.",
            }
        )
    elif has_blog:
        recs.append(
            {
                "title": "Добавить ссылки на блог",
                "body": "Чтобы дать точные рекомендации, добавь хотя бы одну ссылку на активную площадку.",
            }
        )
    else:
        recs.append(
            {
                "title": "Запустить минимальный блог",
                "body": "Стартуй с коротких форматов: 3 экспертных поста, 1 кейс, 1 продающий CTA-блок.",
            }
        )

    if current_stage == "start":
        recs.append(
            {
                "title": "Выбрать 1–2 основные площадки",
                "body": "Не нужно вести всё сразу. Для MVP лучше выбрать самые сильные точки контакта.",
            }
        )
    else:
        recs.append(
            {
                "title": "Внедрить серию прогревающих касаний",
                "body": "Подключи повторяющиеся форматы: серия сторис, чек-лист, кейс недели, предложение месяца.",
            }
        )

    return recs[:6]


def generate_quests(has_blog: bool) -> List[Dict]:
    quests = [
        {
            "title": "Заполнить позиционирование",
            "description": "Сформулируй: кто ты, кому помогаешь, какой результат даёшь.",
            "day_number": 1,
            "status": "todo",
            "reward_points": 20,
        },
        {
            "title": "Согласовать цель месяца",
            "description": "Проверь цель с системой: если цель нереалистична, прими скорректированный вариант.",
            "day_number": 2,
            "status": "todo",
            "reward_points": 20,
        },
        {
            "title": "Собрать 10 тем контента",
            "description": "Подготовь темы, которые показывают экспертность и вызывают диалог.",
            "day_number": 3,
            "status": "todo",
            "reward_points": 15,
        },
        {
            "title": "Описать один кейс",
            "description": "Запрос клиента → действие → результат.",
            "day_number": 4,
            "status": "todo",
            "reward_points": 20,
        },
        {
            "title": "Подготовить CTA",
            "description": "Сделай 3 варианта призыва к действию для контента и сайта.",
            "day_number": 5,
            "status": "todo",
            "reward_points": 10,
        },
        {
            "title": "Итог недели",
            "description": "Отметь прогресс, слабые места и следующую фокусную цель.",
            "day_number": 7,
            "status": "todo",
            "reward_points": 30,
        },
    ]

    if not has_blog:
        quests[4]["title"] = "Опубликовать первый контент"
        quests[4]["description"] = "Сделай первый полезный материал и закончи его CTA."

    return quests


def generate_world_nodes() -> List[Dict]:
    return [
        {
            "category": "base",
            "title": "Продукт",
            "description": "Что именно предлагается клиенту и какой результат он получает.",
            "sort_order": 1,
            "is_locked": False,
        },
        {
            "category": "base",
            "title": "Упаковка",
            "description": "Профиль, оффер, визуал, доверие, структура страницы.",
            "sort_order": 2,
            "is_locked": False,
        },
        {
            "category": "growth",
            "title": "Контент",
            "description": "Рубрики, темы, сценарии материалов и прогрев.",
            "sort_order": 3,
            "is_locked": False,
        },
        {
            "category": "growth",
            "title": "Продажи",
            "description": "Касания, заявки, диагностика, консультация, CTA.",
            "sort_order": 4,
            "is_locked": False,
        },
        {
            "category": "scale",
            "title": "Трафик",
            "description": "Где брать внимание: соцсети, коллаборации, платные каналы, SEO.",
            "sort_order": 5,
            "is_locked": True,
        },
        {
            "category": "scale",
            "title": "Удержание",
            "description": "Повторные продажи, подписка, комьюнити, сопровождение.",
            "sort_order": 6,
            "is_locked": True,
        },
    ]


def generate_trends(niche: str, blog_links: List[Dict[str, str]] | None = None) -> List[Dict]:
    niche_label = niche or "личный бренд"
    platforms = _normalize_platforms(blog_links or [])
    target_platforms = ", ".join(platforms) if platforms else "telegram/youtube/instagram/tiktok"

    return [
        {
            "niche": niche_label,
            "title": "Короткие прикладные форматы",
            "summary": f"На площадках {target_platforms} стабильно работают короткие форматы с одной понятной мыслью.",
            "implementation_tip": "Сделай серию из 5 быстрых материалов: ошибка, совет, кейс, мнение, CTA.",
        },
        {
            "niche": niche_label,
            "title": "Авторский взгляд вместо обезличенной экспертности",
            "summary": "Контент с позицией и авторским мнением вовлекает сильнее сухой информации.",
            "implementation_tip": "Добавляй опыт, наблюдение, кейс и вывод.",
        },
        {
            "niche": niche_label,
            "title": "Квестовая механика в блоге",
            "summary": "Людям проще вовлекаться, когда путь разбит на маленькие шаги с понятным результатом.",
            "implementation_tip": "Упакуй недельную цель в мини-квест с ежедневными шагами и отметкой прогресса.",
        },
    ]
