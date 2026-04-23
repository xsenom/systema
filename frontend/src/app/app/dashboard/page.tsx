"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiRequest } from "@/lib/api";
import AppHeader from "@/components/app/AppHeader";
import RecommendationCard from "@/components/app/RecommendationCard";
import QuestCard from "@/components/app/QuestCard";
import GlassCard from "@/components/ui/GlassCard";
import { getEmailFromWindow } from "@/lib/query";

type DashboardData = {
    email: string;
    profile_name: string;
    niche: string;
    monthly_income_goal: number;
    current_stage: string;
    recommendations: { title: string; body: string }[];
    quests: { title: string; description: string; day_number: number; reward_points: number }[];
    notifications: { title: string; body: string; channel: string }[];
};

export default function DashboardPage() {
    const [email, setEmail] = useState("demo@sistema.local");
    const [data, setData] = useState<DashboardData | null>(null);

    useEffect(() => {
        setEmail(getEmailFromWindow());
    }, []);

    useEffect(() => {
        apiRequest<DashboardData>(`/dashboard/${encodeURIComponent(email)}`)
            .then(setData)
            .catch(console.error);
    }, [email]);

    return (
        <div>
            <AppHeader
                title={data ? `Привет, ${data.profile_name}` : "Загрузка..."}
                subtitle="Здесь собраны главные элементы MVP: цель месяца, рекомендации, квесты и внутренние уведомления."
            />

            <div className="mb-8 grid gap-4 md:grid-cols-3">
                <GlassCard>
                    <div className="text-sm text-white/55">Цель месяца</div>
                    <div className="mt-3 text-3xl font-semibold">
                        {data ? `${data.monthly_income_goal.toLocaleString("ru-RU")} ₽` : "..."}
                    </div>
                </GlassCard>

                <GlassCard>
                    <div className="text-sm text-white/55">Этап</div>
                    <div className="mt-3 text-3xl font-semibold">
                        {data ? data.current_stage : "..."}
                    </div>
                </GlassCard>

                <GlassCard>
                    <div className="text-sm text-white/55">Ниша</div>
                    <div className="mt-3 text-xl font-semibold">
                        {data ? data.niche : "..."}
                    </div>
                </GlassCard>
            </div>

            <div className="mb-8 grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
                <GlassCard>
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-2xl font-semibold">Рекомендации</h2>
                        <Link href={`/app/recommendations?email=${encodeURIComponent(email)}`} className="text-sm text-indigo-200">
                            Смотреть все
                        </Link>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        {data?.recommendations?.slice(0, 4).map((item, index) => (
                            <RecommendationCard key={index} title={item.title} body={item.body} />
                        ))}
                    </div>
                </GlassCard>

                <GlassCard>
                    <h2 className="mb-4 text-2xl font-semibold">Уведомления</h2>
                    <div className="grid gap-3">
                        {data?.notifications?.slice(0, 4).map((item, index) => (
                            <div key={index} className="rounded-2xl bg-white/[0.05] p-4">
                                <div className="text-sm font-medium">{item.title}</div>
                                <div className="mt-1 text-sm text-white/65">[{item.channel}] {item.body}</div>
                            </div>
                        ))}
                    </div>
                </GlassCard>
            </div>

            <GlassCard>
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">Квесты недели</h2>
                    <Link href={`/app/quests?email=${encodeURIComponent(email)}`} className="text-sm text-indigo-200">
                        Все квесты
                    </Link>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {data?.quests?.slice(0, 6).map((item, index) => (
                        <QuestCard
                            key={index}
                            title={item.title}
                            description={item.description}
                            dayNumber={item.day_number}
                            rewardPoints={item.reward_points}
                        />
                    ))}
                </div>
            </GlassCard>
        </div>
    );
}
