"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import AppHeader from "@/components/app/AppHeader";
import WorldNodeCard from "@/components/app/WorldNodeCard";
import { useEmailParam } from "@/lib/query";

type Data = {
    world_nodes: {
        category: string;
        title: string;
        description: string;
        sort_order: number;
        is_locked: boolean;
    }[];
};

export default function WorldPage() {
    const email = useEmailParam();
    const [data, setData] = useState<Data | null>(null);

    useEffect(() => {
        apiRequest<Data>(`/dashboard/${encodeURIComponent(email)}`).then(setData).catch(console.error);
    }, [email]);

    return (
        <div>
            <AppHeader
                title="Карта мира"
                subtitle="Это карта развития клиента: от продукта и упаковки до продаж, трафика и удержания."
            />

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {data?.world_nodes?.map((item, index) => (
                    <WorldNodeCard
                        key={index}
                        category={item.category}
                        title={item.title}
                        description={item.description}
                        isLocked={item.is_locked}
                    />
                ))}
            </div>
        </div>
    );
}
