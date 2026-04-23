type Props = {
    title: string;
    subtitle?: string;
};

export default function AppHeader({ title, subtitle }: Props) {
    return (
        <div className="mb-8 rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl">
            <div className="text-xs uppercase tracking-[0.2em] text-white/60">Система / MVP</div>
            <h1 className="mt-2 text-4xl font-semibold">{title}</h1>
            {subtitle ? <p className="mt-2 max-w-3xl text-white/80">{subtitle}</p> : null}
        </div>
    );
}
