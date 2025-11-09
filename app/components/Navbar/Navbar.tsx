// import { Disclosure } from '@headlessui/react';
// import { Bars3Icon } from '@heroicons/react/24/outline';
// import Link from 'next/link';
// import React from 'react';
// import Drawer from "./Drawer";
// import Drawerdata from "./Drawerdata";
// import Signdialog from "./Signdialog";
// import Registerdialog from "./Registerdialog";
// import Contactus from "./Contactus";
// import { FaHome, FaBookOpen, FaUserGraduate, FaComments, FaUsers, FaEnvelope } from 'react-icons/fa';

// interface NavigationItem {
//     name: string;
//     href: string;
//     current: boolean;
//     icon: React.ReactElement;
// }

// const navigation: NavigationItem[] = [
//     { name: 'Home', href: '/', current: true, icon: <FaHome className="mr-2" /> },
//     { name: 'Courses', href: '#courses-section', current: false, icon: <FaBookOpen className="mr-2" /> },
//     { name: 'Mentors', href: '#mentors-section', current: false, icon: <FaUserGraduate className="mr-2" /> },
//     { name: 'Testimonial', href: '#testimonial-section', current: false, icon: <FaComments className="mr-2" /> },
//     { name: 'Join', href: '#join-section', current: false, icon: <FaUsers className="mr-2" /> },
// ]

// function classNames(...classes: string[]) {
//     return classes.filter(Boolean).join(' ')
// }

// const Navbar = () => {

//     const [isOpen, setIsOpen] = React.useState(false);

//     return (
//         <Disclosure as="nav" className="bg-lightpink navbar">
//             <>
//                 <div className="mx-auto max-w-7xl px-6 lg:px-8">
//                     <div className="relative flex h-20 items-center justify-between">
//                         <div className="flex flex-1 items-center sm:items-stretch sm:justify-start">

//                             {/* LOGO */}

//                             <div className="flex flex-shrink-0 items-center">
//                                 <FaUserGraduate
//                                     className="block h-8 w-8 lg:hidden text-purple"
//                                 />
//                                 <FaUserGraduate
//                                     className="hidden h-12 w-12 lg:block text-purple"
//                                 />
//                             </div>

//                             {/* LINKS */}

//                             <div className="hidden sm:ml-14 md:block">
//                                 <div className="flex space-x-4">
//                                     {navigation.map((item) => (
//                                         <Link
//                                             key={item.name}
//                                             href={item.href}
//                                             className={classNames(
//                                                 item.current ? ' text-purple' : 'hover:text-purple',
//                                                 'px-3 py-4 text-15px font-medium space-links flex items-center'
//                                             )}
//                                             aria-current={item.href ? 'page' : undefined}
//                                         >
//                                             {item.icon}
//                                             {item.name}
//                                         </Link>
//                                     ))}
//                                     <span className="flex items-center px-3 py-4 text-15px space-links">
//                                         <FaEnvelope className="mr-2" />
//                                         <Contactus />
//                                     </span>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* SIGNIN DIALOG */}

//                         <Signdialog />


//                         {/* REGISTER DIALOG */}

//                         <Registerdialog />


//                         {/* DRAWER FOR MOBILE VIEW */}

//                         {/* DRAWER ICON */}

//                         <div className='block md:hidden'>
//                             <Bars3Icon className="block h-6 w-6" aria-hidden="true" onClick={() => setIsOpen(true)} />
//                         </div>

//                         {/* DRAWER LINKS DATA */}

//                         <Drawer isOpen={isOpen} setIsOpen={setIsOpen}>
//                             <Drawerdata />
//                         </Drawer>

//                     </div>
//                 </div>
//             </>
//         </Disclosure>
//     )
// }

// export default Navbar;
'use client';

import { Disclosure } from '@headlessui/react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import React from 'react';
import Drawer from "./Drawer";
import Drawerdata from "./Drawerdata";
import Signdialog from "./Signdialog";
import Registerdialog from "./Registerdialog";
import Contactus from "./Contactus";
import UserProfile from "./UserProfile";
import { FaHome, FaUserGraduate, FaComments, FaUsers, FaEnvelope, FaBriefcase, FaShoppingBag } from 'react-icons/fa';
import { LayoutDashboard } from 'lucide-react';

interface NavigationItem {
    name: string;
    href: string;
    current: boolean;
    icon: React.ReactElement;
}

const navigation: NavigationItem[] = [
    { name: 'Home', href: '/', current: true, icon: <FaHome className="mr-2" /> },
    { name: 'Products', href: '/products', current: false, icon: <FaShoppingBag className="mr-2" /> },
    { name: 'Marketplace', href: '/marketplace', current: false, icon: <FaBriefcase className="mr-2" /> },
    { name: 'Mentors', href: '#mentors-section', current: false, icon: <FaUserGraduate className="mr-2" /> },
    { name: 'Testimonial', href: '#testimonial-section', current: false, icon: <FaComments className="mr-2" /> },
    { name: 'Join', href: '#join-section', current: false, icon: <FaUsers className="mr-2" /> },
    { name: 'Dashboard', href: '/dashboard', current: false, icon: <LayoutDashboard className="mr-2" /> },
]

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

const Navbar = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [user, setUser] = React.useState<any>(null);

    React.useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                setUser(JSON.parse(userData));
            } catch (error) {
                console.error('Erreur:', error);
            }
        }

        const handleUserLogin = () => {
            const userData = localStorage.getItem('user');
            if (userData) {
                setUser(JSON.parse(userData));
            }
        };

        const handleUserLogout = () => {
            setUser(null);
        };

        window.addEventListener('userLoggedIn', handleUserLogin);
        window.addEventListener('userLoggedOut', handleUserLogout);

        return () => {
            window.removeEventListener('userLoggedIn', handleUserLogin);
            window.removeEventListener('userLoggedOut', handleUserLogout);
        };
    }, []);

    return (
        <Disclosure as="nav" className="bg-lightpink navbar">
            <>
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="relative flex h-20 items-center justify-between">
                        <div className="flex flex-1 items-center sm:items-stretch sm:justify-start">

                            {/* LOGO */}
                            <div className="flex flex-shrink-0 items-center">
                                <FaUserGraduate
                                    className="block h-8 w-8 lg:hidden text-purple"
                                />
                                <FaUserGraduate
                                    className="hidden h-12 w-12 lg:block text-purple"
                                />
                            </div>

                            {/* LINKS */}
                            <div className="hidden sm:ml-14 md:block">
                                <div className="flex space-x-4">
                                    {navigation.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={classNames(
                                                item.current ? ' text-purple' : 'hover:text-purple',
                                                'px-3 py-4 text-15px font-medium space-links flex items-center'
                                            )}
                                            aria-current={item.href ? 'page' : undefined}
                                        >
                                            {item.icon}
                                            {item.name}
                                        </Link>
                                    ))}
                                    <span className="flex items-center px-3 py-4 text-15px space-links">
                                        <FaEnvelope className="mr-2" />
                                        <Contactus />
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="hidden md:flex items-center gap-4">
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
                        <div className='block md:hidden'>
                            <Bars3Icon className="block h-6 w-6" aria-hidden="true" onClick={() => setIsOpen(true)} />
                        </div>

                        <Drawer isOpen={isOpen} setIsOpen={setIsOpen}>
                            <Drawerdata />
                        </Drawer>

                    </div>
                </div>
            </>
        </Disclosure>
    )
}

export default Navbar;