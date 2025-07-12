import { AppNavbar } from "@/components/navbar";

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen">
            <AppNavbar>
                <main className="flex-1">
                    {children}
                </main>
            </AppNavbar>
        </div>
    );
}