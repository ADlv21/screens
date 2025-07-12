"use client";

import {
    Navbar,
    NavBody,
    NavItems,
    MobileNav,
    NavbarLogo,
    NavbarButton,
    MobileNavHeader,
    MobileNavToggle,
    MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { IconLogout } from "@tabler/icons-react";
import { useAuth } from "./auth/auth-provider";
import Image from "next/image";

const AuthenticatedNavbar = ({ children }: { children: React.ReactNode }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { name: "Projects", link: "/projects" },
        { name: "Usage", link: "/usage" },
        { name: "Settings", link: "/settings" },
    ];

    const { signOut } = useAuth()

    return (
        <div className="relative w-full">
            <Navbar>
                {/* Desktop Navigation */}
                <NavBody>
                    <NavbarLogo />
                    <NavItems items={navItems} />
                    <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="flex items-center gap-3">
                            <Image
                                src="https://avatar.iran.liara.run/public/boy"
                                alt="User Avatar"
                                className="h-8 w-8 rounded-full border-2 border-border"
                            />
                        </div>

                        {/* Sign Out Button */}
                        <NavbarButton
                            variant="primary"
                            onClick={signOut}
                            className="flex items-center gap-2"
                        >
                            <IconLogout className="h-4 w-4" />
                            Sign Out
                        </NavbarButton>
                    </div>
                </NavBody>

                {/* Mobile Navigation */}
                <MobileNav>
                    <MobileNavHeader>
                        <NavbarLogo />
                        <MobileNavToggle
                            isOpen={isMobileMenuOpen}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        />
                    </MobileNavHeader>

                    <MobileNavMenu
                        isOpen={isMobileMenuOpen}
                        onClose={() => setIsMobileMenuOpen(false)}
                    >
                        {navItems.map((item, idx) => (
                            <a
                                key={`mobile-link-${idx}`}
                                href={item.link}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="relative text-neutral-600 dark:text-neutral-300"
                            >
                                <span className="block">{item.name}</span>
                            </a>
                        ))}

                        {/* Mobile Avatar and Sign Out */}
                        <div className="flex w-full flex-col gap-4 pt-4 border-t border-border">
                            <div className="flex items-center gap-3">
                                <Image
                                    src="https://avatar.iran.liara.run/public/boy"
                                    alt="User Avatar"
                                    className="h-8 w-8 rounded-full border-2 border-border"
                                />
                                <span className="text-sm text-muted-foreground">User</span>
                            </div>
                            <NavbarButton
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    signOut();
                                }}
                                variant="primary"
                                className="w-full flex items-center gap-2"
                            >
                                <IconLogout className="h-4 w-4" />
                                Sign Out
                            </NavbarButton>
                        </div>
                    </MobileNavMenu>
                </MobileNav>
            </Navbar>
            {children}
        </div>
    );
};

export { AuthenticatedNavbar };
