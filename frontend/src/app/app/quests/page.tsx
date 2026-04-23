"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import AppHeader from "@/components/app/AppHeader";
import QuestCard from "@/components/app/QuestCard";
import { useEmailParam } from "@/lib/query";

type Data = {
    quests: {
        title: string;
        description: string;
        day_number: number;
        reward_points: number;
        status: string;
    }[];
};

export default function QuestsPage() {
    const email = useEmailParam();
    const [data, setData] = useState<Data | null>(null);

    useEffect(() => {
        apiRequest<Data>(`/dashboard/${encodeURIComponent(email)}`).then(setData).catch(console.error);
    }, [email]);

    return (
        <div>
            <AppHeader
                title="Квесты"
                subtitle="Это ежедневные шаги для продвижения клиента к результату, а не просто список задач."
            />

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {data?.quests?.map((item, index) => (
                    <QuestCard
                        key={index}
                        title={item.title}
                        description={item.description}
                        dayNumber={item.day_number}
                        rewardPoints={item.reward_points}
                    />
                ))}
            </div>
        </div>
    );
}
