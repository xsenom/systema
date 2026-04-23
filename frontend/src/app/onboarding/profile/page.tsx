"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";

type Answers = {
    product: string;
    audience: string;
    main_problem: string;
    strong_side: string;
    current_income: string;
    resources: string;
    blocker: string;
};

const QUESTION_FLOW: { key: keyof Answers; title: string; placeholder: string; hint: string }[] = [
    {
        key: "product",
        title: "1. Что вы продаёте?",
        placeholder: "Пример: консультации по продвижению, наставничество, онлайн-курс...",
        hint: "Нужна конкретика по продукту/услуге.",
    },
    {
        key: "audience",
        title: "2. Кто ваш клиент?",
        placeholder: "Пример: эксперты 25-40 лет, владельцы малого бизнеса...",
        hint: "Чем точнее сегмент, тем лучше карта мира.",
    },
    {
        key: "main_problem",
        title: "3. Какую проблему клиента вы решаете?",
        placeholder: "Опишите главный запрос клиента и желаемый результат.",
        hint: "Это основа для оффера и контента.",
    },
    {
        key: "strong_side",
        title: "4. В чем ваше ключевое преимущество?",
        placeholder: "Опыт, методология, кейсы, экспертиза...",
        hint: "Сильная сторона используется в позиционировании.",
    },
    {
        key: "current_income",
        title: "5. Какая у вас точка А сейчас?",
        placeholder: "Текущий доход, количество заявок, охваты...",
        hint: "Нужно зафиксировать стартовые метрики.",
    },
    {
        key: "resources",
        title: "6. Какие ресурсы уже есть?",
        placeholder: "Команда, бюджет, контент, база клиентов, время...",
        hint: "Это ускорит построение реалистичного маршрута.",
    },
    {
        key: "blocker",
        title: "7. Что сейчас больше всего тормозит рост?",
        placeholder: "Неясный оффер, мало лидов, нет системы продаж...",
        hint: "Блокер станет отдельным узлом в плане действий.",
    },
];

export default function ProfilePage() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        email: "",
        name: "",
        niche: "",
        description: "",
        monthly_income_goal: 100000,
        current_stage: "start",
        has_blog: false,
        blog_status: "no_blog",
    });

    const [answers, setAnswers] = useState<Answers>({
        product: "",
        audience: "",
        main_problem: "",
        strong_side: "",
        current_income: "",
        resources: "",
        blocker: "",
    });

    const progress = useMemo(() => Math.round(((step + 1) / QUESTION_FLOW.length) * 100), [step]);
    const currentQuestion = QUESTION_FLOW[step];

    const updateField = (key: string, value: string | number | boolean) => setForm((prev) => ({ ...prev, [key]: value }));
    const updateAnswer = (key: keyof Answers, value: string) => setAnswers((prev) => ({ ...prev, [key]: value }));

    const canNext = answers[currentQuestion.key].trim().length > 1;

    const updateAnswer = (key: string, value: string) => {
        setAnswers((prev) => ({ ...prev, [key]: value }));
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const description = [
            `Продукт: ${answers.product}`,
            `Целевая аудитория: ${answers.audience}`,
            `Главная проблема клиента: ${answers.main_problem}`,
            `Сильная сторона эксперта: ${answers.strong_side}`,
            `Точка А: ${answers.current_income}`,
            `Ресурсы: ${answers.resources}`,
            `Главный блокер: ${answers.blocker}`,
            form.description ? `Дополнительно: ${form.description}` : "",
        ].filter(Boolean).join("\n");

        try {
            await apiRequest("/profile", {
                method: "POST",
                body: JSON.stringify({ ...form, description }),
            });

            router.push(`/onboarding/blog?email=${encodeURIComponent(form.email)}&hasBlog=${form.has_blog ? "1" : "0"}`);
        } catch (error) {
            console.error(error);
            alert("Не удалось сохранить профиль");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="mx-auto max-w-4xl px-6 py-12">
            <h1 className="mb-2 text-4xl font-semibold">Профиль клиента</h1>
            <p className="mb-8 text-white/80">Ответьте на вопросы — по ним система построит карту мира и шаги к цели.</p>

            <form onSubmit={handleSubmit} className="glass-surface rounded-[28px] p-6">
                <div className="grid gap-4 md:grid-cols-2">
                    <input className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 outline-none" placeholder="Email" value={form.email} onChange={(e) => updateField("email", e.target.value)} required />
                    <input className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 outline-none" placeholder="Имя" value={form.name} onChange={(e) => updateField("name", e.target.value)} required />
                    <input className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 outline-none" placeholder="Ниша / чем занимаетесь" value={form.niche} onChange={(e) => updateField("niche", e.target.value)} required />
                    <select className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 outline-none" value={form.current_stage} onChange={(e) => updateField("current_stage", e.target.value)}>
                        <option value="start">Старт</option>
                        <option value="growth">Рост</option>
                        <option value="scale">Масштаб</option>
                    </select>
                </div>

                <input className="mt-4 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 outline-none" type="number" placeholder="Цель на месяц (₽)" value={form.monthly_income_goal} onChange={(e) => updateField("monthly_income_goal", Number(e.target.value))} />

                <div className="mt-6 rounded-2xl border border-white/20 bg-slate-900/35 p-5">
                    <div className="mb-2 flex items-center justify-between text-sm text-white/80">
                        <span>Опрос клиента</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="mb-4 h-2 rounded-full bg-white/10">
                        <div className="h-2 rounded-full bg-blue-400 transition-all" style={{ width: `${progress}%` }} />
                    </div>

                    <label className="mb-2 block text-lg font-medium">{currentQuestion.title}</label>
                    <p className="mb-3 text-sm text-white/70">{currentQuestion.hint}</p>
                    <textarea
                        className="min-h-28 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 outline-none"
                        placeholder={currentQuestion.placeholder}
                        value={answers[currentQuestion.key]}
                        onChange={(e) => updateAnswer(currentQuestion.key, e.target.value)}
                    />

                    <div className="mt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={() => setStep((s) => Math.max(0, s - 1))}
                            disabled={step === 0}
                            className="rounded-full border border-white/25 px-4 py-2 disabled:opacity-40"
                        >
                            Назад
                        </button>
                        {step < QUESTION_FLOW.length - 1 ? (
                            <button
                                type="button"
                                onClick={() => setStep((s) => Math.min(QUESTION_FLOW.length - 1, s + 1))}
                                disabled={!canNext}
                                className="rounded-full bg-blue-500 px-5 py-2 font-medium disabled:opacity-40"
                            >
                                Далее
                            </button>
                        ) : (
                            <button type="submit" disabled={loading || !canNext} className="rounded-full bg-blue-500 px-6 py-2 font-medium disabled:opacity-40">
                                {loading ? "Сохраняем..." : "Сохранить профиль"}
                            </button>
                        )}
                    </div>
                </div>

                <textarea className="mt-4 min-h-20 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 outline-none" placeholder="Дополнительный контекст (опционально)" value={form.description} onChange={(e) => updateField("description", e.target.value)} />

                <label className="mt-4 flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3">
                    <input
                        type="checkbox"
                        checked={form.has_blog}
                        onChange={(e) => {
                            updateField("has_blog", e.target.checked);
                            updateField("blog_status", e.target.checked ? "active_blog" : "no_blog");
                        }}
                    />
                    <span>Я веду блог / соцсети / канал</span>
                </label>
            </form>
        </main>
    );
}
