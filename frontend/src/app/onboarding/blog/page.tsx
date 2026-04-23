"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { apiRequest } from "@/lib/api";

const initialLinks = [
    { platform: "telegram", url: "" },
    { platform: "youtube", url: "" },
    { platform: "instagram", url: "" },
    { platform: "tiktok", url: "" },
    { platform: "website", url: "" },
];

export default function BlogPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";
    const [links, setLinks] = useState(initialLinks);

    const updateLink = (index: number, value: string) => {
        setLinks((prev) => prev.map((item, i) => (i === index ? { ...item, url: value } : item)));
    };

    async function handleNext() {
        try {
            await apiRequest("/blog-links", {
                method: "POST",
                body: JSON.stringify({ email, links }),
            });
            router.push(`/legal?email=${encodeURIComponent(email)}`);
        } catch (error) {
            console.error(error);
            alert("Не удалось сохранить ссылки");
        }
    }

    return (
        <main className="mx-auto max-w-3xl px-6 py-12">
            <h1 className="mb-3 text-4xl font-semibold">Блог и площадки</h1>
            <p className="mb-8 text-white/70">
                Если блог уже есть, добавь ссылки. Если нет, можно оставить часть полей пустыми.
            </p>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.05] p-6">
                <div className="grid gap-4">
                    {links.map((item, index) => (
                        <div key={item.platform}>
                            <label className="mb-2 block text-sm uppercase tracking-[0.2em] text-white/55">
                                {item.platform}
                            </label>
                            <input
                                className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 outline-none"
                                placeholder={`https://${item.platform}.com/...`}
                                value={item.url}
                                onChange={(e) => updateLink(index, e.target.value)}
                            />
                        </div>
                    ))}
                </div>

                <button
                    onClick={handleNext}
                    className="mt-6 rounded-full bg-indigo-500 px-6 py-3 font-medium text-white transition hover:bg-indigo-400"
                >
                    Продолжить
                </button>
            </div>
        </main>
    );
}