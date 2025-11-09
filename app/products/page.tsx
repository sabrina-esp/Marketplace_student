"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ProductCard from '../components/Products/ProductCard';
import ProductDetailsModal from '../components/Products/ProductDetailsModal';
import ChatDrawer from '../components/Chat/ChatDrawer';
import { Product } from '../components/Products/data';

export const dynamic = 'force-dynamic';

type PaginationState = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

const initialPagination: PaginationState = {
  page: 1,
  pageSize: 12,
  total: 0,
  totalPages: 1,
};

export default function ProductsPage() {
  const [query, setQuery] = useState('');
  const [type, setType] = useState<string>('all');
  const [fileType, setFileType] = useState<string>('all');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [sort, setSort] = useState<string>('newest');
  const [page, setPage] = useState(1);
  const pageSize = 12;
  const [selected, setSelected] = useState<Product | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationState>(initialPagination);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const resetToFirstPage = useCallback(() => setPage(1), []);

  const fetchProducts = useCallback(async () => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('pageSize', String(pageSize));
      if (query.trim()) params.set('q', query.trim());
      if (type !== 'all') params.set('category', type);
      if (fileType !== 'all') params.set('fileType', fileType);
      if (minPrice.trim()) params.set('minPrice', minPrice.trim());
      if (maxPrice.trim()) params.set('maxPrice', maxPrice.trim());
      if (sort) params.set('sort', sort);

      const res = await fetch(`/api/products?${params.toString()}`, {
        method: 'GET',
        signal: controller.signal,
        cache: 'no-store',
      });
      if (!res.ok) {
        throw new Error('Failed to load products');
      }
      const data = await res.json();
      setProducts(Array.isArray(data.items) ? data.items : []);
      if (data.pagination) {
        setPagination({
          page: data.pagination.page ?? page,
          pageSize: data.pagination.pageSize ?? pageSize,
          total: data.pagination.total ?? 0,
          totalPages: data.pagination.totalPages ?? 1,
        });
        if (
          typeof data.pagination.totalPages === 'number' &&
          data.pagination.totalPages > 0 &&
          page > data.pagination.totalPages
        ) {
          setPage(data.pagination.totalPages);
        }
      } else {
        setPagination({ ...initialPagination, page });
      }
    } catch (err: any) {
      if (err?.name === 'AbortError') return;
      console.error('Product fetch error', err);
      setError(err.message ?? 'Unable to load products');
      setProducts([]);
      setPagination({ ...initialPagination, page });
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }, [page, pageSize, query, type, fileType, minPrice, maxPrice, sort]);

  useEffect(() => {
    fetchProducts();
    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, [fetchProducts]);

  const pageCount = pagination.totalPages ?? 1;
  const currentPage = pagination.page ?? page;

  const paginationButtons = useMemo(() => {
    const buttons = [];
    const count = Math.min(pageCount, 6);
    for (let i = 1; i <= count; i += 1) {
      buttons.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={`px-4 py-2 rounded-lg border ${
            currentPage === i ? 'bg-purple text-white border-purple' : 'border-gray-200'
          }`}
        >
          {i}
        </button>,
      );
    }
    return buttons;
  }, [currentPage, pageCount]);

  return (
    <main className="bg-white min-h-screen pb-24">
      <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">All Products</h1>
            <p className="text-gray-600">Browse all available student resources</p>
          </div>
          <div className="w-full sm:w-auto flex items-center gap-2">
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                resetToFirstPage();
              }}
              placeholder="Search products..."
              className="w-full sm:w-80 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple focus:border-purple"
            />
            <button
              onClick={() => setChatOpen(true)}
              className="bg-purple text-white font-semibold px-4 py-2.5 rounded-lg hover:opacity-90 whitespace-nowrap"
            >
              Ask AI
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <aside className="bg-white border border-gray-100 rounded-xl p-4 h-max">
            <div className="mb-4">
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Category</label>
              <select
                value={type}
                onChange={(e) => {
                  setType(e.target.value);
                  resetToFirstPage();
                }}
                className="w-full border border-gray-200 rounded-lg px-3 py-2"
              >
                <option value="all">All</option>
                <option value="Project">Project</option>
                <option value="Resume">Resume</option>
                <option value="Past Exam">Past Exam</option>
                <option value="Internship Report">Internship Report</option>
                <option value="Presentation">Presentation</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="text-sm font-semibold text-gray-700 mb-1 block">File Type</label>
              <select
                value={fileType}
                onChange={(e) => {
                  setFileType(e.target.value);
                  resetToFirstPage();
                }}
                className="w-full border border-gray-200 rounded-lg px-3 py-2"
              >
                <option value="all">All</option>
                <option value="pdf">PDF</option>
                <option value="zip">ZIP</option>
                <option value="docx">DOCX</option>
                <option value="pptx">PPTX</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">Min Price</label>
                <input
                  value={minPrice}
                  onChange={(e) => {
                    setMinPrice(e.target.value);
                    resetToFirstPage();
                  }}
                  placeholder="0"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">Max Price</label>
                <input
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(e.target.value);
                    resetToFirstPage();
                  }}
                  placeholder="100"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Sort by</label>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  resetToFirstPage();
                }}
                className="w-full border border-gray-200 rounded-lg px-3 py-2"
              >
                <option value="newest">Newest</option>
                <option value="popular">Most Popular</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </aside>
          <section className="lg:col-span-3">
            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50/60 px-4 py-6 text-sm text-red-600">
                {error}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {loading
                    ? Array.from({ length: 6 }).map((_, idx) => (
                        <div
                          key={idx}
                          className="h-64 rounded-2xl border border-gray-100 bg-gray-50 animate-pulse"
                        />
                      ))
                    : products.map((p) => <ProductCard key={p.id} product={p} onOpen={setSelected} />)}
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-8">
                  <div className="text-sm text-gray-600">
                    Page {currentPage} of {pageCount} • {pagination.total} results
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1 || loading}
                      className="px-4 py-2 rounded-lg border border-gray-200 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    {paginationButtons}
                    <button
                      onClick={() => setPage((prev) => Math.min(pageCount, prev + 1))}
                      disabled={currentPage === pageCount || loading}
                      className="px-4 py-2 rounded-lg border border-gray-200 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
      <ProductDetailsModal product={selected} onClose={() => setSelected(null)} />
      <ChatDrawer isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </main>
  );
}

