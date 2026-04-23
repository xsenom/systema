"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { useState } from "react";

export default function HomePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function openReadyDemo() {
        setLoading(true);
        try {
            const res = await apiRequest<{ ok: boolean; email: string }>("/seed-demo", {
                method: "POST",
            });
            router.push(`/app/dashboard?email=${encodeURIComponent(res.email)}`);
        } catch (error) {
            console.error(error);
            alert("Не удалось загрузить demo");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-12">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
                <div>
                    <div className="mb-4 inline-flex rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-white/70">
                        MVP версия
                    </div>

                    <h1 className="max-w-3xl text-5xl font-semibold leading-tight md:text-7xl">
                        Система
                    </h1>

                    <p className="mt-6 max-w-2xl text-base leading-7 text-white/70 md:text-lg">
                        Сервис, который собирает профиль клиента, оценивает текущую точку,
                        анализирует блог, предлагает рекомендации, квесты, карту развития и
                        контентные ориентиры на ближайший месяц.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-4">
                        <button
                            onClick={openReadyDemo}
                            disabled={loading}
                            className="rounded-full bg-indigo-500 px-6 py-3 font-medium text-white transition hover:bg-indigo-400 disabled:opacity-60"
                        >
                            {loading ? "Готовим demo..." : "Открыть готовое demo"}
                        </button>

                        <Link
                            href="/onboarding/profile"
                            className="rounded-full border border-white/10 bg-white/[0.05] px-6 py-3 font-medium text-white transition hover:bg-white/[0.09]"
                        >
                            Пройти сценарий вручную
                        </Link>
                    </div>
                </div>

                <div className="rounded-[36px] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl">
                    <div className="grid gap-4">
                        <div className="rounded-[28px] bg-gradient-to-br from-indigo-500/30 to-fuchsia-500/20 p-6">
                            <div className="mb-2 text-sm text-white/60">Профиль</div>
                            <div className="text-2xl font-semibold">Кто клиент, что продаёт, куда хочет прийти</div>
                        </div>

                        <div className="rounded-[28px] bg-white/[0.05] p-6">
                            <div className="mb-2 text-sm text-white/60">Анализ</div>
                            <div className="text-2xl font-semibold">Рекомендации, блог, цели, тренды</div>
                        </div>

                        <div className="rounded-[28px] bg-white/[0.05] p-6">
                            <div className="mb-2 text-sm text-white/60">Действие</div>
                            <div className="text-2xl font-semibold">Квесты, карта мира и ежедневные шаги</div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}