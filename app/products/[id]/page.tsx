import Link from 'next/link';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import BuyNowButton from '../../components/Products/BuyNowButton';
import { Product } from '../../components/Products/data';

type ProductPageProps = {
  params: {
    id: string;
  };
};

const getBaseUrl = () => {
  const headerList = headers();
  const protocol = headerList.get('x-forwarded-proto') ?? 'http';
  const host = headerList.get('host');
  if (!host) {
    return '';
  }
  return `${protocol}://${host}`;
};

const fetchProduct = async (id: string): Promise<Product | null> => {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    getBaseUrl() ||
    'http://localhost:3000';

  const endpoint = `${baseUrl}/api/products/${id}`;
  const res = await fetch(endpoint, { cache: 'no-store' });
  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    throw new Error('Failed to load product');
  }
  const data = await res.json();
  return data?.product ?? null;
};

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: ProductPageProps) {
  try {
    const product = await fetchProduct(params.id);
    if (!product) {
      return {
        title: 'Product not found | Marketplace',
      };
    }

    return {
      title: `${product.title} | Marketplace`,
      description: product.description,
    };
  } catch {
    return {
      title: 'Product | Marketplace',
    };
  }
}

export default async function ProductDetailsPage({ params }: ProductPageProps) {
  let product: Product | null = null;
  try {
    product = await fetchProduct(params.id);
  } catch (error) {
    console.error('Failed to load product detail', error);
  }

  if (!product) {
    notFound();
  }

  const initials =
    product.title
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase() ?? '')
      .join('') || 'P';
  const formattedDate = product.date
    ? new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(new Date(product.date))
    : null;

  return (
    <main className="bg-white min-h-screen pb-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/products"
          className="inline-flex items-center text-sm font-semibold text-purple-600 hover:text-purple-700"
        >
          ← Back to products
        </Link>

        <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <section>
            <div className="relative aspect-[4/3] rounded-3xl border border-gray-100 bg-gradient-to-br from-purple-50 via-white to-blue-50 shadow-sm overflow-hidden flex flex-col items-center justify-center gap-5 p-10 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-3xl font-semibold text-purple-600 shadow-lg">
                {initials}
              </div>
              <div className="space-y-2 max-w-xl">
                <p className="text-sm font-semibold uppercase tracking-wide text-purple-600">
                  Premium Student Resource
                </p>
                <p className="text-base text-gray-700">
                  {product.title}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-gray-600">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/80 border border-gray-100">
                  {product.category}
                </span>
                {product.fileType && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/80 border border-gray-100 uppercase">
                    {product.fileType}
                  </span>
                )}
                {formattedDate && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/80 border border-gray-100">
                    Updated {formattedDate}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-10 rounded-3xl border border-gray-100 bg-gray-50 p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Overview</h2>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
          </section>

          <aside className="space-y-6 lg:space-y-8">
            <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-md">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-100">
                    {product.category}
                  </span>
                  <h1 className="mt-4 text-3xl font-bold text-gray-900 leading-tight">{product.title}</h1>
                  {product.author && (
                    <p className="mt-2 text-sm text-gray-600">
                      Created by <span className="font-semibold text-gray-800">{product.author}</span>
                    </p>
                  )}
                </div>
                <div className="text-right text-gray-900">
                  <span className="text-xl font-semibold text-purple-600">USD</span>
                  <div className="text-4xl font-extrabold tracking-tight">${product.price}</div>
                </div>
              </div>

              <dl className="mt-6 space-y-3 text-sm text-gray-600">
                {formattedDate && (
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <dt className="font-medium text-gray-500">Last updated</dt>
                    <dd className="font-semibold text-gray-800">{formattedDate}</dd>
                  </div>
                )}
                {product.fileType && (
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <dt className="font-medium text-gray-500">File type</dt>
                    <dd className="font-semibold text-gray-800 uppercase">{product.fileType}</dd>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <dt className="font-medium text-gray-500">Instant download</dt>
                  <dd className="font-semibold text-gray-800">Available after purchase</dd>
                </div>
              </dl>

              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <BuyNowButton price={product.price} />
                <Link
                  href="/marketplace/manage"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center px-4 py-3 rounded-lg border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50"
                >
                  Save for later
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-100 bg-gray-50 p-6 sm:p-7 shadow-inner">
              <h3 className="text-base font-semibold text-gray-900 mb-4">What you&apos;ll get</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-purple-400" />
                  Complete downloadable files ready to use
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-purple-400" />
                  Lifetime access to updates from the author
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-purple-400" />
                  Dedicated support through marketplace chat
                </li>
              </ul>
            </div>

            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="text-base font-semibold text-gray-900 mb-3">Looking for something else?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Explore our full catalog of projects, courses, templates, and more resources created by students.
              </p>
              <Link
                href="/products"
                className="w-full inline-flex items-center justify-center px-4 py-3 rounded-lg bg-purple text-white font-semibold hover:opacity-90"
              >
                Browse all products
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
