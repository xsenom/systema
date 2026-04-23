"use client";

import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "@/lib/api";
import AppHeader from "@/components/app/AppHeader";
import { useEmailParam } from "@/lib/query";

type Node = {
    category: string;
    title: string;
    description: string;
    sort_order: number;
    is_locked: boolean;
};

type Data = { world_nodes: Node[] };

type PositionedNode = Node & { x: number; y: number };

const BASE_POSITIONS = [
    { x: 120, y: 320 },
    { x: 360, y: 320 },
    { x: 620, y: 170 },
    { x: 620, y: 470 },
    { x: 900, y: 170 },
    { x: 900, y: 470 },
    { x: 1180, y: 320 },
    { x: 1450, y: 320 },
    { x: 1710, y: 320 },
];

const EDGES: [number, number][] = [
    [0, 1],
    [1, 2],
    [1, 3],
    [2, 4],
    [3, 5],
    [4, 6],
    [5, 6],
    [6, 7],
    [7, 8],
];

export default function WorldPage() {
    const email = useEmailParam();
    const [data, setData] = useState<Data | null>(null);

    useEffect(() => {
        apiRequest<Data>(`/dashboard/${encodeURIComponent(email)}`).then(setData).catch(console.error);
    }, [email]);

    const nodes = useMemo<PositionedNode[]>(() => {
        const source = [...(data?.world_nodes ?? [])].sort((a, b) => a.sort_order - b.sort_order);
        return source.map((node, index) => ({ ...node, ...(BASE_POSITIONS[index] ?? { x: 200 + index * 220, y: 320 }) }));
    }, [data?.world_nodes]);

    return (
        <div>
            <AppHeader
                title="Карта мира"
                subtitle="Визуал в формате Miro: большая доска, сетка, карточки и связи между шагами достижения цели."
            />

            <div className="overflow-auto rounded-3xl border border-black/10 bg-[#ececec] p-6">
                <div
                    className="relative min-h-[760px] min-w-[1900px] rounded-2xl border border-[#d9d9d9]"
                    style={{
                        backgroundColor: "#efefef",
                        backgroundImage:
                            "linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)",
                        backgroundSize: "48px 48px",
                    }}
                >
                    <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
                        {EDGES.map(([from, to], idx) => {
                            if (!nodes[from] || !nodes[to]) return null;
                            const x1 = nodes[from].x + 180;
                            const y1 = nodes[from].y + 50;
                            const x2 = nodes[to].x;
                            const y2 = nodes[to].y + 50;

                            return (
                                <line
                                    key={idx}
                                    x1={x1}
                                    y1={y1}
                                    x2={x2}
                                    y2={y2}
                                    stroke="#9f9f9f"
                                    strokeWidth="2"
                                />
                            );
                        })}
                    </svg>

                    {nodes.map((node, index) => (
                        <div
                            key={`${node.title}-${index}`}
                            className="absolute w-[180px] rounded-md border border-[#b8b8b8] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.15)]"
                            style={{ left: node.x, top: node.y }}
                        >
                            <div className="rounded-t-md bg-[#2d9cf0] px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                                {node.category}
                            </div>
                            <div className="px-2 py-2 text-[12px] text-[#1f2937]">
                                <div className="mb-1 font-semibold leading-4">{node.sort_order}. {node.title}</div>
                                <div className="leading-4 text-[#3f3f46]">{node.description}</div>
                                {node.is_locked ? (
                                    <div className="mt-2 inline-block rounded bg-[#f2f2f2] px-2 py-1 text-[10px] text-[#6b7280]">закрыто</div>
                                ) : null}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
