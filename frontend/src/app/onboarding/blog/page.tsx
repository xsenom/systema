"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { getEmailFromWindow } from "@/lib/query";

const initialLinks = [
    { platform: "telegram", url: "" },
    { platform: "youtube", url: "" },
    { platform: "instagram", url: "" },
    { platform: "tiktok", url: "" },
    { platform: "website", url: "" },
];

type AnalysisData = {
    recommendations: { title: string; body: string }[];
};

export default function BlogPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [hasBlog, setHasBlog] = useState(false);
    const [links, setLinks] = useState(initialLinks);
    const [analysis, setAnalysis] = useState<AnalysisData | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setEmail(getEmailFromWindow(""));
        setHasBlog(params.get("hasBlog") === "1");
    }, []);

    const updateLink = (index: number, value: string) => {
        setLinks((prev) => prev.map((item, i) => (i === index ? { ...item, url: value } : item)));
    };

    async function handleAnalyze() {
        if (!email) return;

        await apiRequest("/blog-links", {
            method: "POST",
            body: JSON.stringify({ email, links }),
        });

        const res = await apiRequest<AnalysisData>(`/blog-analysis/${encodeURIComponent(email)}`);
        setAnalysis(res);
    }

    async function handleNext() {
        const filledLinks = links.filter((item) => item.url.trim()).length;
        if (hasBlog && filledLinks === 0) {
            alert("Вы отметили, что ведёте блог. Добавьте хотя бы одну ссылку.");
            return;
        }

        try {
            await handleAnalyze();
            router.push(`/legal?email=${encodeURIComponent(email)}`);
        } catch (error) {
            console.error(error);
            alert("Не удалось сохранить ссылки");
        }
    }

    return (
        <main className="mx-auto max-w-3xl px-6 py-12">
            <h1 className="mb-3 text-4xl font-semibold">Блог и площадки</h1>
            <p className="mb-8 text-white/70">Если блог уже есть, добавь ссылки — система даст рекомендации до оплаты.</p>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.05] p-6">
                <div className="grid gap-4">
                    {links.map((item, index) => (
                        <div key={item.platform}>
                            <label className="mb-2 block text-sm uppercase tracking-[0.2em] text-white/55">{item.platform}</label>
                            <input
                                className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 outline-none"
                                placeholder={`https://${item.platform}.com/...`}
                                value={item.url}
                                onChange={(e) => updateLink(index, e.target.value)}
                            />
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex gap-3">
                    <button onClick={handleAnalyze} className="rounded-full border border-white/20 px-6 py-3">Проверить блог</button>
                    <button onClick={handleNext} className="rounded-full bg-indigo-500 px-6 py-3 font-medium text-white transition hover:bg-indigo-400">Продолжить</button>
                </div>

                {analysis && (
                    <div className="mt-6 rounded-2xl bg-white/[0.04] p-4">
                        <div className="mb-3 text-sm text-white/60">Предварительные рекомендации:</div>
                        <ul className="grid gap-2 text-sm text-white/80">
                            {analysis.recommendations.map((item, index) => (
                                <li key={index}>• <strong>{item.title}:</strong> {item.body}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </main>
    );
}
