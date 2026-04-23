import GlassCard from "@/components/ui/GlassCard";

type Props = {
    category: string;
    title: string;
    description: string;
    isLocked: boolean;
};

export default function WorldNodeCard({ category, title, description, isLocked }: Props) {
    return (
        <GlassCard className={isLocked ? "opacity-70" : ""}>
            <div className="mb-3 flex items-center justify-between">
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/60">
          {category}
        </span>
                <span className="text-xs text-white/60">{isLocked ? "Закрыто" : "Открыто"}</span>
            </div>
            <h3 className="mb-2 text-xl font-semibold">{title}</h3>
            <p className="text-sm leading-6 text-white/70">{description}</p>
        </GlassCard>
    );
}