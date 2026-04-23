type Props = {
    children: React.ReactNode;
    className?: string;
};

export default function GlassCard({ children, className = "" }: Props) {
    return (
        <div className={`glass-surface rounded-[28px] p-5 ${className}`}>
            {children}
        </div>
    );
}
