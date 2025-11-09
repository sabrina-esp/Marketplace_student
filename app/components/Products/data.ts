export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  fileType?: string | null;
  thumbnail?: string | null;
  imageSrc?: string | null;
  author?: string | null;
  date?: string | null;
  popularity?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type ProductsResponse = {
  items: Product[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

