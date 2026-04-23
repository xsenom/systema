"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { useState } from "react";

export default function HomePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function openReadyMvp() {
        setLoading(true);
        try {
            const res = await apiRequest<{ ok: boolean; email: string }>("/seed-mvp", { method: "POST" });
            router.push(`/app/dashboard?email=${encodeURIComponent(res.email)}`);
        } catch (error) {
            console.error(error);
            alert("Не удалось запустить MVP-профиль");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-6 py-12">
            <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                <div>
                    <div className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/90">MVP ready</div>
                    <h1 className="max-w-3xl text-5xl font-semibold leading-tight md:text-7xl">Система</h1>
                    <p className="mt-6 max-w-2xl text-base leading-7 text-white/80 md:text-lg">
                        Не демо-лендинг, а рабочий MVP: профиль клиента, ссылки на блог, согласия, оплата и автоматическая генерация
                        рекомендаций, квестов, карты мира и трендов.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-4">
                        <button
                            onClick={openReadyMvp}
                            disabled={loading}
                            className="rounded-full bg-blue-500 px-6 py-3 font-medium text-white transition hover:bg-blue-400 disabled:opacity-60"
                        >
                            {loading ? "Запускаем MVP..." : "Открыть готовый MVP-профиль"}
                        </button>

                        <Link
                            href="/onboarding/profile"
                            className="rounded-full border border-white/20 bg-white/10 px-6 py-3 font-medium text-white transition hover:bg-white/15"
                        >
                            Пройти полный onboarding
                        </Link>
                    </div>
                </div>

                <div className="relative grid gap-5 md:grid-cols-2">
                    <div className="glass-surface relative min-h-[430px] rounded-[36px] p-5">
                        <div className="absolute left-4 top-4 h-14 w-14 rounded-full bg-gradient-to-br from-violet-200/70 to-transparent blur-sm" />
                        <div className="mt-24 rounded-[28px] bg-slate-900/35 p-5">
                            <div className="text-2xl font-semibold">Explore the stars</div>
                            <p className="mt-3 text-sm text-white/80">Путь клиента в формате квеста: шаги, цели и ежедневный прогресс.</p>
                            <button className="mt-5 rounded-full bg-blue-500/80 px-5 py-2 text-sm">Fly with stars</button>
                        </div>
                    </div>

                    <div className="glass-surface relative min-h-[430px] rounded-[36px] p-5">
                        <div className="mb-4 flex items-center justify-between text-sm text-white/90">
                            <span>Karim Saif</span>
                            <span className="rounded-full bg-white/15 px-3 py-1">12334 🪙</span>
                        </div>
                        <div className="rounded-[24px] bg-slate-900/35 p-4">
                            <div className="text-2xl font-semibold">Fly with stars</div>
                            <button className="mt-3 rounded-full bg-blue-500/80 px-4 py-2 text-sm">Fly</button>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                            <div className="rounded-2xl bg-slate-900/35 p-3">Mars<br /><span className="text-white/70">0.03 ETH</span></div>
                            <div className="rounded-2xl bg-slate-900/35 p-3">Venus<br /><span className="text-white/70">123 km</span></div>
                        </div>

                        <div className="absolute bottom-4 left-4 right-4 rounded-full bg-slate-900/45 px-4 py-3 text-center text-sm text-white/80">
                            MVP flow: Profile → Blog → Legal → Pay → Dashboard
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
