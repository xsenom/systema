"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { getEmailFromWindow } from "@/lib/query";

export default function LegalPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");

    useEffect(() => {
        setEmail(getEmailFromWindow(""));
    }, []);

    const [policy, setPolicy] = useState(false);
    const [offer, setOffer] = useState(false);
    const [personal, setPersonal] = useState(false);
    const [wallet, setWallet] = useState(true);

    async function handleNext() {
        try {
            await apiRequest("/legal", {
                method: "POST",
                body: JSON.stringify({ email, accepted_policy: policy, accepted_offer: offer, accepted_personal_data: personal }),
            });

            if (wallet) {
                await apiRequest("/wallet-consent", {
                    method: "POST",
                    body: JSON.stringify({ email }),
                });
            }

            router.push(`/pay?email=${encodeURIComponent(email)}`);
        } catch (error) {
            console.error(error);
            alert("Нужно принять все согласия");
        }
    }

    return (
        <main className="mx-auto max-w-3xl px-6 py-12">
            <h1 className="mb-3 text-4xl font-semibold">Согласия</h1>
            <p className="mb-8 text-white/70">Перед оплатой фиксируем оферту, политику и выбор канала уведомлений.</p>
            <div className="rounded-[28px] border border-white/10 bg-white/[0.05] p-6">
                <div className="grid gap-4">
                    <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-4"><input type="checkbox" checked={policy} onChange={(e) => setPolicy(e.target.checked)} /><span>Принимаю политику конфиденциальности</span></label>
                    <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-4"><input type="checkbox" checked={offer} onChange={(e) => setOffer(e.target.checked)} /><span>Принимаю оферту</span></label>
                    <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-4"><input type="checkbox" checked={personal} onChange={(e) => setPersonal(e.target.checked)} /><span>Согласен(а) на обработку персональных данных</span></label>
                    <label className="flex items-center gap-3 rounded-2xl border border-indigo-400/40 bg-indigo-500/10 px-4 py-4"><input type="checkbox" checked={wallet} onChange={(e) => setWallet(e.target.checked)} /><span>Подключить wallet-уведомления (рекомендуется)</span></label>
                </div>
                <button onClick={handleNext} className="mt-6 rounded-full bg-indigo-500 px-6 py-3 font-medium text-white transition hover:bg-indigo-400">Перейти к оплате</button>
            </div>
        </main>
    );
}
