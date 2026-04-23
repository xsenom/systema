import AppSidebar from "@/components/app/AppSidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
            <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
                <div className="phone-shell p-4">
                    <AppSidebar />
                </div>
                <div className="phone-shell relative overflow-hidden p-6">
                    <div className="star-dots absolute inset-0" />
                    <div className="relative">{children}</div>
                </div>
            </div>
        </main>
    );
}
