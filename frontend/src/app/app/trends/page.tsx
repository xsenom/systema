"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import AppHeader from "@/components/app/AppHeader";
import GlassCard from "@/components/ui/GlassCard";
import { useEmailParam } from "@/lib/query";

type Data = {
    trends: { niche: string; title: string; summary: string; implementation_tip: string }[];
};

export default function TrendsPage() {
    const email = useEmailParam();
    const [data, setData] = useState<Data | null>(null);

    useEffect(() => {
        apiRequest<Data>(`/dashboard/${encodeURIComponent(email)}`).then(setData).catch(console.error);
    }, [email]);

    return (
        <div>
            <AppHeader title="Тренды" subtitle="Ориентиры по формату блога и нише клиента." />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {data?.trends?.map((item, index) => (
                    <GlassCard key={index}>
                        <div className="mb-2 text-xs uppercase tracking-[0.2em] text-white/50">{item.niche}</div>
                        <h3 className="mb-3 text-xl font-semibold">{item.title}</h3>
                        <p className="mb-4 text-sm leading-6 text-white/70">{item.summary}</p>
                        <div className="rounded-2xl bg-white/[0.05] p-4 text-sm text-lime-200">{item.implementation_tip}</div>
                    </GlassCard>
                ))}
            </div>
        </div>
    );
}
