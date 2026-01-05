export interface IFlower {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  count: number;
  type: string;
  discount: number;
  searchQuery: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  count: number;
}

export interface CartItemApi {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  count: number;
}
