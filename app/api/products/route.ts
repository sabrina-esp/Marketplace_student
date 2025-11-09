import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/db/mongodb';
import Product from '../../../lib/models/Product';

const DEFAULT_PAGE_SIZE = 12;

const serializeProduct = (product: any) => {
  const obj = product.toObject ? product.toObject() : product;
  return {
    id: obj._id.toString(),
    title: obj.title,
    description: obj.description,
    price: obj.price,
    category: obj.category,
    fileType: obj.fileType ?? null,
    thumbnail: obj.thumbnail ?? obj.imageSrc ?? null,
    author: obj.author ?? null,
    date: obj.date ? new Date(obj.date).toISOString() : null,
    popularity: obj.popularity ?? 0,
    createdAt: obj.createdAt?.toISOString?.() ?? obj.createdAt,
    updatedAt: obj.updatedAt?.toISOString?.() ?? obj.updatedAt,
  };
};

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(Number(searchParams.get('page') ?? '1'), 1);
    const pageSize = Math.min(
      Math.max(Number(searchParams.get('pageSize') ?? DEFAULT_PAGE_SIZE), 1),
      100,
    );
    const search = searchParams.get('q')?.trim();
    const category = searchParams.get('category')?.trim();
    const fileType = searchParams.get('fileType')?.trim();
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sortParam = searchParams.get('sort') ?? 'newest';

    const filters: Record<string, unknown> = {};

    if (search) {
      filters.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category && category.toLowerCase() !== 'all') {
      filters.category = new RegExp(`^${category}$`, 'i');
    }

    if (fileType && fileType.toLowerCase() !== 'all') {
      filters.fileType = new RegExp(`^${fileType}$`, 'i');
    }

    if (minPrice) {
      const parsed = Number(minPrice);
      if (!Number.isNaN(parsed)) {
        filters.price = { ...(filters.price as Record<string, number>), $gte: parsed };
      }
    }

    if (maxPrice) {
      const parsed = Number(maxPrice);
      if (!Number.isNaN(parsed)) {
        filters.price = { ...(filters.price as Record<string, number>), $lte: parsed };
      }
    }

    let sort: Record<string, 1 | -1> = { createdAt: -1 };
    if (sortParam === 'popular') {
      sort = { popularity: -1, updatedAt: -1 };
    } else if (sortParam === 'price-asc') {
      sort = { price: 1 };
    } else if (sortParam === 'price-desc') {
      sort = { price: -1 };
    }

    const [items, total] = await Promise.all([
      Product.find(filters)
        .sort(sort)
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean(),
      Product.countDocuments(filters),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return NextResponse.json({
      items: items.map(serializeProduct),
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
      },
    });
  } catch (error: any) {
    console.error('Error fetching products', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const product = await Product.create({
      title: body.title,
      description: body.description,
      price: body.price,
      category: body.category,
      fileType: body.fileType ?? null,
      thumbnail: body.thumbnail ?? body.imageSrc ?? null,
      author: body.author ?? null,
      date: body.date ?? null,
      popularity: body.popularity ?? 0,
    });

    return NextResponse.json({ product: serializeProduct(product) }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}


