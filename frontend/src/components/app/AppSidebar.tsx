"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const items = [
    { href: "/app/dashboard", label: "Dashboard" },
    { href: "/app/world", label: "Карта мира" },
    { href: "/app/quests", label: "Квесты" },
    { href: "/app/recommendations", label: "Рекомендации" },
    { href: "/app/trends", label: "Тренды" },
    { href: "/app/profile", label: "Профиль" },
];

export default function AppSidebar() {
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "demo@sistema.local";

    return (
        <aside className="w-full rounded-[28px] border border-white/10 bg-white/[0.05] p-5 lg:w-72">
            <div className="mb-6">
                <div className="text-sm text-white/50">Система</div>
                <div className="mt-1 text-2xl font-semibold">MVP</div>
            </div>

            <nav className="grid gap-2">
                {items.map((item) => (
                    <Link
                        key={item.href}
                        href={`${item.href}?email=${encodeURIComponent(email)}`}
                        className="rounded-2xl border border-white/5 bg-white/[0.04] px-4 py-3 text-white/85 transition hover:bg-white/[0.09]"
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}