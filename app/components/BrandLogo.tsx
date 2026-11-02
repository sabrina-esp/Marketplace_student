import Link from 'next/link';
import Image from 'next/image';

interface BrandLogoProps {
    variant?: 'light' | 'dark';
    className?: string;
}

// Edit public/brand/icon.svg for the shared icon, then run npm run generate:icons.
// Update the brand name here.
export default function BrandLogo({ variant = 'light', className = '' }: BrandLogoProps) {
    const onDark = variant === 'dark';

    return (
        <Link href="/" aria-label="Marketplace Student home" className={`inline-flex shrink-0 items-center ${className}`}>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl shadow-sm">
                <Image src="/brand/icon.svg" alt="" width={44} height={44} className="h-11 w-11" aria-hidden="true" />
            </span>
            <span className={`ml-3 text-sm font-bold leading-tight ${onDark ? 'text-white' : 'text-gray-900'}`}>
                Marketplace
                <span className={`block text-xs font-medium tracking-wide ${onDark ? 'text-white' : 'text-purple'}`}>Student</span>
            </span>
        </Link>
    );
}
