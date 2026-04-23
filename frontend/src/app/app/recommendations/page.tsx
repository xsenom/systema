"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import AppHeader from "@/components/app/AppHeader";
import RecommendationCard from "@/components/app/RecommendationCard";
import { useEmailParam } from "@/lib/query";

type Data = { recommendations: { title: string; body: string }[] };

export default function RecommendationsPage() {
    const email = useEmailParam();
    const [data, setData] = useState<Data | null>(null);

    useEffect(() => {
        apiRequest<Data>(`/dashboard/${encodeURIComponent(email)}`).then(setData).catch(console.error);
    }, [email]);

    return (
        <div>
            <AppHeader title="Рекомендации" subtitle="Подсказки по профилю, блогу и стадии роста." />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {data?.recommendations?.map((item, index) => (
                    <RecommendationCard key={index} title={item.title} body={item.body} />
                ))}
            </div>
        </div>
    );
}
