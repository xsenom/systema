"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";

export default function ProfilePage() {
    const router = useRouter();

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

    const [loading, setLoading] = useState(false);

    const updateField = (key: string, value: string | number | boolean) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            await apiRequest("/profile", {
                method: "POST",
                body: JSON.stringify(form),
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
        <main className="mx-auto max-w-3xl px-6 py-12">
            <h1 className="mb-3 text-4xl font-semibold">Профиль клиента</h1>
            <p className="mb-8 text-white/70">
                Это первая точка MVP. Здесь собираем данные для рекомендаций и плана роста.
            </p>

            <form onSubmit={handleSubmit} className="rounded-[28px] border border-white/10 bg-white/[0.05] p-6">
                <div className="grid gap-4 md:grid-cols-2">
                    <input
                        className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 outline-none"
                        placeholder="Email"
                        value={form.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        required
                    />
                    <input
                        className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 outline-none"
                        placeholder="Имя"
                        value={form.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        required
                    />
                    <input
                        className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 outline-none"
                        placeholder="Ниша / чем занимаетесь"
                        value={form.niche}
                        onChange={(e) => updateField("niche", e.target.value)}
                        required
                    />
                    <select
                        className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 outline-none"
                        value={form.current_stage}
                        onChange={(e) => updateField("current_stage", e.target.value)}
                    >
                        <option value="start">Старт</option>
                        <option value="growth">Рост</option>
                        <option value="scale">Масштаб</option>
                    </select>
                </div>

                <textarea
                    className="mt-4 min-h-32 w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 outline-none"
                    placeholder="Что вы делаете, какой продукт, какая текущая точка"
                    value={form.description}
                    onChange={(e) => updateField("description", e.target.value)}
                />

                <input
                    className="mt-4 w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 outline-none"
                    type="number"
                    placeholder="Цель на месяц"
                    value={form.monthly_income_goal}
                    onChange={(e) => updateField("monthly_income_goal", Number(e.target.value))}
                />

                <label className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3">
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

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-6 rounded-full bg-indigo-500 px-6 py-3 font-medium text-white transition hover:bg-indigo-400 disabled:opacity-60"
                >
                    {loading ? "Сохраняем..." : "Продолжить"}
                </button>
            </form>
        </main>
    );
}