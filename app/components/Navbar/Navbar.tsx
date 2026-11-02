'use client';

import { Bars3Icon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import React from 'react';
import Drawer from "./Drawer";
import Drawerdata from "./Drawerdata";
import Signdialog from "./Signdialog";
import Registerdialog from "./Registerdialog";
import UserProfile from "./UserProfile";
import InstallButton from "./InstallButton";
import BrandLogo from '../BrandLogo';

import { navigation } from './navigation';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { usePathname } from 'next/navigation';

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

const Navbar = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const user = useCurrentUser();
    const pathname = usePathname();

    React.useEffect(() => {
        const desktop = window.matchMedia('(min-width: 1280px)');
        const closeOnDesktop = () => { if (desktop.matches) setIsOpen(false); };
        desktop.addEventListener('change', closeOnDesktop);
        return () => desktop.removeEventListener('change', closeOnDesktop);
    }, []);

    return (
        <nav aria-label="Main navigation" className="navbar border-b border-purple/10 bg-white/95 backdrop-blur-xl">
            <>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="relative flex h-20 items-center justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-6">

                            {/* LOGO */}
                            <BrandLogo />

                            {/* LINKS */}
                            <div className="hidden xl:block">
                                <div className="flex gap-1">
                                    {navigation.map((item) => {
                                        // Hide auth-required items if not logged in
                                        if (item.requireAuth && !user) return null;

                                        return (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className={classNames(
                                                    pathname === item.href ? 'bg-purple/10 text-purple' : 'text-gray-600 hover:bg-purple/5 hover:text-purple',
                                                    'rounded-xl px-2.5 py-3 text-sm font-medium whitespace-nowrap flex items-center transition-colors'
                                                )}
                                                aria-current={pathname === item.href ? 'page' : undefined}
                                            >

                                                {item.name}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="hidden xl:flex shrink-0 items-center gap-3">
                            {/* Install PWA Button */}
                            <InstallButton />

                            {user ? (
                                <UserProfile />
                            ) : (
                                <>
                                    <Signdialog />
                                    <Registerdialog />
                                </>
                            )}
                        </div>

                        {/* DRAWER FOR MOBILE VIEW */}
                        <button type="button" className="xl:hidden flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-purple/10 text-purple transition-colors hover:bg-purple/5" aria-label="Open navigation" aria-expanded={isOpen} onClick={() => setIsOpen(true)}>
                            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                        </button>

                        <Drawer isOpen={isOpen} setIsOpen={setIsOpen}>
                            <Drawerdata />
                        </Drawer>

                    </div>
                </div>
            </>
        </nav>
    )
}

export default Navbar;
