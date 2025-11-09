"use client";
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import ProductCard from './ProductCard';
import { Product } from './data';
import ProductDetailsModal from './ProductDetailsModal';

const ProductsSection = () => {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [selected, setSelected] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const fetchFeatured = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/products?page=1&pageSize=6&sort=popular', {
          cache: 'no-store',
        });
        if (!res.ok) {
          throw new Error('Failed to load products');
        }
        const data = await res.json();
        if (active) {
          setFeatured(Array.isArray(data.items) ? data.items : []);
        }
      } catch (err: any) {
        if (active) {
          setError(err.message ?? 'Unable to load featured products right now');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    fetchFeatured();
    return () => {
      active = false;
    };
  }, []);

  const content = useMemo(() => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="h-64 rounded-2xl border border-gray-100 bg-gray-50 animate-pulse"
            />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="rounded-2xl border border-red-100 bg-red-50/60 px-4 py-6 text-sm text-red-600">
          {error}
        </div>
      );
    }

    if (featured.length === 0) {
      return (
        <div className="rounded-2xl border border-gray-100 bg-gray-50/80 px-4 py-6 text-sm text-gray-600">
          No featured products yet. Check back soon or explore the full catalog.
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {featured.map((p) => (
          <ProductCard key={p.id} product={p} onOpen={setSelected} />
        ))}
      </div>
    );
  }, [featured, loading, error]);

  return (
    <section id="products-section" className="bg-white">
      <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">Featured Products</h2>
            <p className="text-gray-600">Projects, papers, internships, and more curated for you</p>
          </div>
          <Link
            href="/products"
            className="mt-4 sm:mt-0 bg-purple text-white font-semibold py-2.5 px-6 rounded-lg hover:opacity-90 transition-all hover:shadow-lg"
          >
            View All
          </Link>
        </div>
        {content}
      </div>
      <ProductDetailsModal product={selected} onClose={() => setSelected(null)} />
    </section>
  );
};

export default ProductsSection;

