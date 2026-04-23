"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import AppHeader from "@/components/app/AppHeader";
import GlassCard from "@/components/ui/GlassCard";

type Data = {
    email: string;
    profile_name: string;
    niche: string;
    monthly_income_goal: number;
    current_stage: string;
};

export default function ProfilePage({
                                        searchParams,
                                    }: {
    searchParams: { email?: string };
}) {
    const email = searchParams.email || "demo@sistema.local";
    const [data, setData] = useState<Data | null>(null);

    useEffect(() => {
        apiRequest<Data>(`/dashboard/${encodeURIComponent(email)}`).then(setData).catch(console.error);
    }, [email]);

    return (
        <div>
            <AppHeader
                title="Профиль"
                subtitle="Здесь можно показать основные данные клиента и будущие точки расширения: wallet, уведомления, каналы."
            />

            <div className="grid gap-4 md:grid-cols-2">
                <GlassCard>
                    <div className="text-sm text-white/55">Имя</div>
                    <div className="mt-2 text-2xl font-semibold">{data?.profile_name || "..."}</div>
                </GlassCard>

                <GlassCard>
                    <div className="text-sm text-white/55">Email</div>
                    <div className="mt-2 text-xl font-semibold">{data?.email || "..."}</div>
                </GlassCard>

                <GlassCard>
                    <div className="text-sm text-white/55">Ниша</div>
                    <div className="mt-2 text-xl font-semibold">{data?.niche || "..."}</div>
                </GlassCard>

                <GlassCard>
                    <div className="text-sm text-white/55">Цель на месяц</div>
                    <div className="mt-2 text-2xl font-semibold">
                        {data ? `${data.monthly_income_goal.toLocaleString("ru-RU")} ₽` : "..."}
                    </div>
                </GlassCard>

                <GlassCard>
                    <div className="text-sm text-white/55">Wallet</div>
                    <div className="mt-2 text-xl font-semibold">Подключение позже</div>
                    <p className="mt-2 text-sm text-white/70">
                        В MVP это заглушка под web push, email и возможную wallet-механику.
                    </p>
                </GlassCard>

                <GlassCard>
                    <div className="text-sm text-white/55">Уведомления</div>
                    <div className="mt-2 text-xl font-semibold">Site / Email / Future wallet</div>
                    <p className="mt-2 text-sm text-white/70">
                        Позже здесь будет управление ежедневными тегами, напоминаниями и шагами квестов.
                    </p>
                </GlassCard>
            </div>
        </div>
    );
}