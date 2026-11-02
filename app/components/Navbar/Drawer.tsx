import { Fragment, ReactNode } from 'react';
import BrandLogo from '../BrandLogo';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface DrawerProps {
  children: ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Drawer({ children, isOpen, setIsOpen }: DrawerProps) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex justify-end">
          <Dialog.Panel className="w-full max-w-sm overflow-y-auto bg-white p-5 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <Dialog.Title as="div"><BrandLogo /></Dialog.Title>
              <button type="button" aria-label="Close navigation" className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple/5 text-purple" onClick={() => setIsOpen(false)}>
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div onClick={(event) => {
              if ((event.target as HTMLElement).closest('a')) setIsOpen(false);
            }}>{children}</div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}
