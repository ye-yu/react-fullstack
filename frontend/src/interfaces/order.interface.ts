export interface OrderEntity {
  id: number;
  orderId: string;
  productStringId: string;
  priceDuringOrderMYR: number;
  photosDuringOrder: string[];
  nameDuringOrder: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}
