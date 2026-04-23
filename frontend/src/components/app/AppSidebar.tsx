"use client";

import Link from "next/link";
import { useEmailParam } from "@/lib/query";

const items = [
    { href: "/app/dashboard", label: "Dashboard", icon: "🏠" },
    { href: "/app/world", label: "Карта мира", icon: "🌍" },
    { href: "/app/quests", label: "Квесты", icon: "🎯" },
    { href: "/app/recommendations", label: "Советы", icon: "💡" },
    { href: "/app/trends", label: "Тренды", icon: "📈" },
    { href: "/app/profile", label: "Профиль", icon: "👤" },
];

export default function AppSidebar() {
    const email = useEmailParam();

    return (
        <aside className="h-full rounded-[28px] border border-white/15 bg-slate-900/35 p-5 backdrop-blur-xl">
            <div className="mb-6">
                <div className="text-xs uppercase tracking-[0.2em] text-white/60">Sistema</div>
                <div className="mt-2 text-2xl font-semibold">Space MVP</div>
            </div>

            <nav className="grid gap-2">
                {items.map((item) => (
                    <Link
                        key={item.href}
                        href={`${item.href}?email=${encodeURIComponent(email)}`}
                        className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-white/90 transition hover:bg-white/15"
                    >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>
        </aside>
    );
}
