export interface IFlower {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  count: number;
  type: string;
  quantity?: number;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  count: number;
}
