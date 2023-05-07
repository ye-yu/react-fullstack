export interface ProductEntity {
  id: number;
  productStringId: string;
  priceMYR: number;
  name: string;
  photos: string[];
  stockCount: number;
  categoryId: number;
  brandId: number;
  brand: {
    name: string;
  };
  category: {
    name: string;
  };
  colors: { name: string }[];
}
