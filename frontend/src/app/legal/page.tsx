"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { apiRequest } from "@/lib/api";

export default function LegalPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";

    const [policy, setPolicy] = useState(false);
    const [offer, setOffer] = useState(false);
    const [personal, setPersonal] = useState(false);

    async function handleNext() {
        try {
            await apiRequest("/legal", {
                method: "POST",
                body: JSON.stringify({
                    email,
                    accepted_policy: policy,
                    accepted_offer: offer,
                    accepted_personal_data: personal,
                }),
            });

            router.push(`/pay?email=${encodeURIComponent(email)}`);
        } catch (error) {
            console.error(error);
            alert("Нужно принять все согласия");
        }
    }

    return (
        <main className="mx-auto max-w-3xl px-6 py-12">
            <h1 className="mb-3 text-4xl font-semibold">Согласия</h1>
            <p className="mb-8 text-white/70">Для MVP фиксируем обязательный шаг перед активацией плана.</p>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.05] p-6">
                <div className="grid gap-4">
                    <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-4">
                        <input type="checkbox" checked={policy} onChange={(e) => setPolicy(e.target.checked)} />
                        <span>Принимаю политику конфиденциальности</span>
                    </label>

                    <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-4">
                        <input type="checkbox" checked={offer} onChange={(e) => setOffer(e.target.checked)} />
                        <span>Принимаю оферту</span>
                    </label>

                    <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-4">
                        <input type="checkbox" checked={personal} onChange={(e) => setPersonal(e.target.checked)} />
                        <span>Согласен(а) на обработку персональных данных</span>
                    </label>
                </div>

                <button
                    onClick={handleNext}
                    className="mt-6 rounded-full bg-indigo-500 px-6 py-3 font-medium text-white transition hover:bg-indigo-400"
                >
                    Перейти к оплате
                </button>
            </div>
        </main>
    );
}