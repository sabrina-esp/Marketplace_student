import { redirect } from 'next/navigation';

// Preserve previously emailed/bookmarked URLs without duplicating the verification UI.
export default function VerificationRedirect({ searchParams }) {
  const token = typeof searchParams.token === 'string' ? searchParams.token : '';
  redirect(token ? `/verify-email?token=${encodeURIComponent(token)}` : '/verify-email');
}
