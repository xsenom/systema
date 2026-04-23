import GlassCard from "@/components/ui/GlassCard";

type Props = {
    title: string;
    description: string;
    dayNumber: number;
    rewardPoints: number;
};

export default function QuestCard({ title, description, dayNumber, rewardPoints }: Props) {
    return (
        <GlassCard className="bg-slate-900/35">
            <div className="mb-3 flex items-center justify-between">
                <span className="rounded-full bg-blue-400/25 px-3 py-1 text-xs text-blue-100">День {dayNumber}</span>
                <span className="text-sm text-white/70">+{rewardPoints} XP</span>
            </div>
            <h3 className="mb-2 text-xl font-semibold">{title}</h3>
            <p className="text-sm leading-6 text-white/80">{description}</p>
        </GlassCard>
    );
}
