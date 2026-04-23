"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import AppHeader from "@/components/app/AppHeader";
import RecommendationCard from "@/components/app/RecommendationCard";

type Data = {
    recommendations: {
        title: string;
        body: string;
    }[];
};

export default function RecommendationsPage({
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
                title="Рекомендации"
                subtitle="Это блок стратегических подсказок, собранных по профилю, стадии роста и наличию блога."
            />

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {data?.recommendations?.map((item, index) => (
                    <RecommendationCard key={index} title={item.title} body={item.body} />
                ))}
            </div>
        </div>
    );
}