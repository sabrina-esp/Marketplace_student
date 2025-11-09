import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '../../../../lib/db/mongodb';
import Product from '../../../../lib/models/Product';

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

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }
    const product = await Product.findById(params.id).lean();
    if (!product) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ product: serializeProduct(product) });
  } catch (error) {
    console.error('Error fetching product', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }

    const body = await request.json();
    const product = await Product.findByIdAndUpdate(
      params.id,
      {
        $set: {
          ...(body.title !== undefined ? { title: body.title } : {}),
          ...(body.description !== undefined ? { description: body.description } : {}),
          ...(body.price !== undefined ? { price: body.price } : {}),
          ...(body.category !== undefined ? { category: body.category } : {}),
          ...(body.fileType !== undefined ? { fileType: body.fileType } : {}),
          ...(body.thumbnail !== undefined
            ? { thumbnail: body.thumbnail }
            : body.imageSrc !== undefined
            ? { thumbnail: body.imageSrc }
            : {}),
          ...(body.author !== undefined ? { author: body.author } : {}),
          ...(body.date !== undefined ? { date: body.date } : {}),
          ...(body.popularity !== undefined ? { popularity: body.popularity } : {}),
        },
      },
      { new: true },
    );

    if (!product) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ product: serializeProduct(product) });
  } catch (error) {
    console.error('Error updating product', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }

    const deleted = await Product.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}


