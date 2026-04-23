import GlassCard from "@/components/ui/GlassCard";

type Props = {
    title: string;
    body: string;
};

export default function RecommendationCard({ title, body }: Props) {
    return (
        <GlassCard className="bg-slate-900/35">
            <h3 className="mb-3 text-xl font-semibold">{title}</h3>
            <p className="text-sm leading-6 text-white/80">{body}</p>
        </GlassCard>
    );
}
