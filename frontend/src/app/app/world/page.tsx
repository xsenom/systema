"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import AppHeader from "@/components/app/AppHeader";
import WorldNodeCard from "@/components/app/WorldNodeCard";
import { useEmailParam } from "@/lib/query";

type Node = {
    category: string;
    title: string;
    description: string;
    sort_order: number;
    is_locked: boolean;
};

type Data = { world_nodes: Node[] };

export default function WorldPage() {
    const email = useEmailParam();
    const [data, setData] = useState<Data | null>(null);

    useEffect(() => {
        apiRequest<Data>(`/dashboard/${encodeURIComponent(email)}`).then(setData).catch(console.error);
    }, [email]);

    const nodes = data?.world_nodes ?? [];

    return (
        <div>
            <AppHeader
                title="Карта мира"
                subtitle="Карта формируется сразу после заполнения профиля. Логика как в Miro: видим цель и пошаговый маршрут её достижения."
            />

            <div className="space-y-3">
                {nodes.map((item, index) => (
                    <div key={`${item.title}-${index}`}>
                        <WorldNodeCard
                            category={item.category}
                            title={`${item.sort_order}. ${item.title}`}
                            description={item.description}
                            isLocked={item.is_locked}
                        />
                        {index < nodes.length - 1 ? (
                            <div className="mx-auto my-2 h-8 w-[2px] bg-gradient-to-b from-white/60 to-transparent" />
                        ) : null}
                    </div>
                ))}
            </div>
        </div>
    );
}
