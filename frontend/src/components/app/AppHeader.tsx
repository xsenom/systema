type Props = {
    title: string;
    subtitle?: string;
};

export default function AppHeader({ title, subtitle }: Props) {
    return (
        <div className="mb-8">
            <div className="text-sm text-white/50">Система / MVP</div>
            <h1 className="mt-2 text-4xl font-semibold">{title}</h1>
            {subtitle ? <p className="mt-2 max-w-3xl text-white/70">{subtitle}</p> : null}
        </div>
    );
}