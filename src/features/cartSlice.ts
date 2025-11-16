import { IFlower } from '@/types/IFlower';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type CartItem = IFlower & { quantity: number };

interface CartState {
  items: CartItem[];
  favs: IFlower[];
  paid: IFlower[];
}

const initialState: CartState = {
  items: [],
  favs: [],
  paid: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<IFlower>) => {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        item.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    addToFav: (state, action) => {
      const exists = state.favs.some((i) => i.id === action.payload.id);
      if (!exists) {
        state.favs.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromFavs: (state, action: PayloadAction<number>) => {
      state.favs = state.favs.filter((i) => i.id !== action.payload);
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    cleanFavs: (state) => {
      state.favs = [];
    },
    clearCart: (state) => {
      state.items = [];
    },
    increaseQuantity(state, action: PayloadAction<number>) {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.quantity += 1;
    },
    decreaseQuantity(state, action: PayloadAction<number>) {
      const item = state.items.find((i) => i.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      } else {
        state.items = state.items.filter((i) => i.id !== action.payload);
      }
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  decreaseQuantity,
  increaseQuantity,
  addToFav,
  removeFromFavs,
  cleanFavs,
} = cartSlice.actions;
export default cartSlice.reducer;
