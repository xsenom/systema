type Props = {
    children: React.ReactNode;
    className?: string;
};

export default function GlassCard({ children, className = "" }: Props) {
    return (
        <div
            className={`rounded-[28px] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.35)] ${className}`}
        >
            {children}
        </div>
    );
}