import AppSidebar from "@/components/app/AppSidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
            <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
                <AppSidebar />
                <div>{children}</div>
            </div>
        </main>
    );
}