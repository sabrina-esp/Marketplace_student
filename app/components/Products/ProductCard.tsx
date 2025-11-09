"use client";
import Link from 'next/link';
import { Product } from './data';

type Props = {
  product: Product;
  onOpen?: (product: Product) => void;
};

const getInitials = (value: string) =>
  value
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('') || 'P';

const ProductCard = ({ product, onOpen }: Props) => {
  const initials = getInitials(product.title);

  return (
    <article className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:scale-[1.02] hover:-translate-y-1">
      <div className="p-5 pb-3">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-purple/5 text-purple-700 border border-purple/10">
            {product.category}
          </span>
          {product.fileType && (
            <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
              {product.fileType}
            </span>
          )}
        </div>

        <div className="mt-6 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple/10 text-lg font-semibold text-purple-600 shadow-sm">
            {initials}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-1">
              {product.title}
            </h3>
            {product.author && (
              <p className="text-xs font-medium text-gray-500 mt-1">By {product.author}</p>
            )}
          </div>
        </div>
      </div>

      <div className="px-5 pb-5">
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{product.description}</p>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-gray-900 font-extrabold text-xl">${product.price}</span>
          {onOpen ? (
            <button
              onClick={() => onOpen(product)}
              className="bg-purple text-white font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition-all hover:shadow-lg"
            >
              View Details
            </button>
          ) : (
            <Link
              href={`/products/${product.id}`}
              className="bg-purple text-white font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition-all hover:shadow-lg"
            >
              View Details
            </Link>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProductCard;

