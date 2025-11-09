"use client";
import Link from 'next/link';
import BuyNowButton from './BuyNowButton';
import { Product } from './data';

type Props = {
  product: Product | null;
  onClose: () => void;
};

const ProductDetailsModal = ({ product, onClose }: Props) => {
  if (!product) return null;
  const formattedDate = product.date
    ? new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(
        new Date(product.date),
      )
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-gray-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="font-bold">Product Details</div>
          <button onClick={onClose} className="text-white/90 hover:text-white">
            ✕
          </button>
        </div>
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{product.title}</h2>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                  {product.category}
                </span>
                {product.author && <span>By {product.author}</span>}
                {formattedDate && <span>{formattedDate}</span>}
                {product.fileType && (
                  <span className="px-2 py-0.5 bg-gray-100 rounded border border-gray-200 uppercase tracking-wide">
                    {product.fileType}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-gray-900 font-extrabold text-2xl">${product.price}</div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-6">
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
            <Link
              href={`/products/${product.id}`}
              onClick={onClose}
              className="inline-flex items-center justify-center px-4 py-3 rounded-lg border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50"
            >
              Open full page
            </Link>
            <BuyNowButton price={product.price} />
            <button onClick={onClose} className="px-4 py-3 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;

