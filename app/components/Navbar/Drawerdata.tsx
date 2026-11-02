import React from "react";
import Link from "next/link";
import Contactus from './Contactus';

import { navigation } from './navigation';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { usePathname } from 'next/navigation';
import Signdialog from './Signdialog';
import Registerdialog from './Registerdialog';
import UserProfile from './UserProfile';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const Data = () => {
  const user = useCurrentUser();
  const pathname = usePathname();

  return (
    <div className="rounded-md max-w-sm w-full mx-auto">
      <div className="flex-1 space-y-4 py-1">
        <div className="sm:block">
          <div className="space-y-2 pt-2 pb-3">
            {navigation.map((item) => {
              // Hide auth-required items if not logged in
              if (item.requireAuth && !user) return null;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    pathname === item.href ? 'bg-purple-50 text-purple' : 'text-black hover:bg-purple-50 hover:text-purple',
                    'block px-4 py-3 rounded-xl text-base font-medium transition-colors'
                  )}
                  aria-current={pathname === item.href ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              );
            })}
            <Contactus />
            <div className="mt-4"></div>
            {user ? <UserProfile /> : <div className="flex flex-wrap gap-3"><Signdialog /><Registerdialog /></div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Data;
