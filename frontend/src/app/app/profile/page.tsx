"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import AppHeader from "@/components/app/AppHeader";
import GlassCard from "@/components/ui/GlassCard";
import { useEmailParam } from "@/lib/query";

type Data = {
    email: string;
    profile_name: string;
    niche: string;
    monthly_income_goal: number;
    current_stage: string;
};

export default function ProfilePage() {
    const email = useEmailParam();
    const [data, setData] = useState<Data | null>(null);

    useEffect(() => {
        apiRequest<Data>(`/dashboard/${encodeURIComponent(email)}`).then(setData).catch(console.error);
    }, [email]);

    return (
        <div>
            <AppHeader
                title="Профиль"
                subtitle="Здесь можно показать основные данные клиента и каналы уведомлений."
            />

            <div className="grid gap-4 md:grid-cols-2">
                <GlassCard><div className="text-sm text-white/55">Имя</div><div className="mt-2 text-2xl font-semibold">{data?.profile_name || "..."}</div></GlassCard>
                <GlassCard><div className="text-sm text-white/55">Email</div><div className="mt-2 text-xl font-semibold">{data?.email || "..."}</div></GlassCard>
                <GlassCard><div className="text-sm text-white/55">Ниша</div><div className="mt-2 text-xl font-semibold">{data?.niche || "..."}</div></GlassCard>
                <GlassCard><div className="text-sm text-white/55">Цель на месяц</div><div className="mt-2 text-2xl font-semibold">{data ? `${data.monthly_income_goal.toLocaleString("ru-RU")} ₽` : "..."}</div></GlassCard>
            </div>
        </div>
    );
}
