import { AppNavbar } from "@/components/navbar";
import "@/app/globals.css";

export default function StaticLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="h-screen">
            <AppNavbar>
                {children}
            </AppNavbar>
        </div>
    );
}