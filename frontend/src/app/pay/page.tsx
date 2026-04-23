"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { getEmailFromWindow } from "@/lib/query";

export default function PayPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setEmail(getEmailFromWindow(""));
    }, []);

    async function handlePay() {
        setLoading(true);
        try {
            await apiRequest("/payment", {
                method: "POST",
                body: JSON.stringify({ email, plan_name: "Sistema MVP", amount: 990, status: "paid" }),
            });
            await apiRequest(`/generate/${encodeURIComponent(email)}`, { method: "POST" });
            router.push(`/app/dashboard?email=${encodeURIComponent(email)}`);
        } catch (error) {
            console.error(error);
            alert("Ошибка активации плана");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="mx-auto max-w-3xl px-6 py-12">
            <h1 className="mb-3 text-4xl font-semibold">Активация MVP</h1>
            <p className="mb-8 text-white/70">После оплаты система создаст план, квесты, карту мира и ежедневные уведомления.</p>
            <div className="rounded-[28px] border border-white/10 bg-white/[0.05] p-6">
                <div className="rounded-[24px] bg-white/[0.05] p-5">
                    <div className="text-sm text-white/55">План</div><div className="mt-2 text-2xl font-semibold">Sistema MVP</div><div className="mt-3 text-white/75">990 ₽</div>
                </div>
                <button onClick={handlePay} disabled={loading} className="mt-6 rounded-full bg-lime-400 px-6 py-3 font-medium text-black transition hover:bg-lime-300 disabled:opacity-60">{loading ? "Активируем..." : "Активировать план"}</button>
            </div>
        </main>
    );
}
