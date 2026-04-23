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
        <main className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center overflow-hidden px-6 py-10">
            <div className="pointer-events-none absolute -left-24 top-8 h-80 w-80 rounded-full bg-fuchsia-300/25 blur-2xl" />
            <div className="pointer-events-none absolute right-0 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-blue-400/25 blur-2xl" />

            <div className="relative grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                <div>
                    <div className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm">MVP версия</div>
                    <h1 className="text-6xl font-semibold leading-tight">Система</h1>
                    <p className="mt-5 max-w-xl text-white/80">
                        Полностью рабочий MVP: профиль, анализ блога, согласия, оплата и ежедневные квесты в стиле космического интерфейса.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-4">
                        <button onClick={openReadyMvp} disabled={loading} className="rounded-full bg-blue-500 px-6 py-3 font-medium transition hover:bg-blue-400 disabled:opacity-60">
                            {loading ? "Запуск..." : "Открыть MVP"}
                        </button>
                        <Link href="/onboarding/profile" className="rounded-full border border-white/20 bg-white/10 px-6 py-3 font-medium transition hover:bg-white/15">
                            Ручной onboarding
                        </Link>
                    </div>
                </div>

                <div className="relative flex items-end justify-center gap-6">
                    <div className="phone-shell relative h-[620px] w-[290px] overflow-hidden p-5">
                        <div className="star-dots absolute inset-0" />
                        <div className="relative mt-24 rounded-[30px] border border-white/20 bg-white/10 p-6 backdrop-blur-xl">
                            <h3 className="text-3xl font-semibold">Explore the stars</h3>
                            <p className="mt-3 text-sm text-white/80">The world of stars is full of wonderful places and beautiful life.</p>
                            <button className="mt-6 w-full rounded-full bg-blue-500/80 py-3">Fly with stars</button>
                        </div>
                    </div>

                    <div className="phone-shell relative h-[650px] w-[300px] overflow-hidden p-5">
                        <div className="star-dots absolute inset-0" />
                        <div className="relative flex items-center justify-between rounded-2xl bg-white/10 px-3 py-2 text-sm backdrop-blur-xl">
                            <span>Karim Saif</span>
                            <span className="rounded-full bg-white/20 px-3 py-1">12334 🪙</span>
                        </div>

                        <div className="relative mt-4 rounded-3xl border border-white/20 bg-white/12 p-4 backdrop-blur-xl">
                            <div className="text-4xl font-semibold">Fly with stars</div>
                            <button className="mt-3 rounded-full bg-blue-500/80 px-4 py-2">Fly</button>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                            <div className="rounded-2xl border border-white/15 bg-white/10 p-3">Mars<br /><span className="text-white/70">0.03 ETH</span></div>
                            <div className="rounded-2xl border border-white/15 bg-white/10 p-3">Moon<br /><span className="text-white/70">123 km</span></div>
                        </div>

                        <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/20 bg-slate-900/45 px-4 py-3 text-xs text-white/85 backdrop-blur-xl">
                            Profile → Blog → Legal → Pay → Dashboard
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
