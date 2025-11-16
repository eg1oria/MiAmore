import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '@/app/api/CartApi';
import { IFlower } from '@/types/IFlower';

// Тип элемента корзины с сервера
export interface CartItem {
  id: string; // ID элемента корзины (server item id)
  productId: string; // ID товара
  name: string;
  price: number;
  count: number; // количество на сервере
}

export const loadCart = createAsyncThunk('cart/load', async () => {
  return await api.get();
});

export const serverAddToCart = createAsyncThunk('cart/add', async (flower: IFlower) => {
  await api.add({
    productId: String(flower.id),
    name: flower.name,
    price: flower.price,
    count: 1,
  });
  return await api.get();
});

export const serverRemoveFromCart = createAsyncThunk(
  'cart/remove',
  async (serverItemId: string) => {
    await api.remove(serverItemId);
    return await api.get();
  },
);

export const serverUpdateCount = createAsyncThunk(
  'cart/updateCount',
  async ({ itemId, count }: { itemId: string; count: number }) => {
    await api.updateCount(itemId, count);
    return await api.get();
  },
);

interface CartState {
  items: CartItem[];
  status: 'idle' | 'loading' | 'failed';
}

const initialState: CartState = {
  items: [],
  status: 'idle',
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Увеличить количество (по ID элемента корзины)
    increaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.count += 1;
    },
    // Уменьшить количество (по ID элемента корзины)
    decreaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (!item) return;
      if (item.count > 1) {
        item.count -= 1;
      } else {
        state.items = state.items.filter((i) => i.id !== action.payload);
      }
    },
    // Очистить корзину
    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    // Load Cart
    builder.addCase(loadCart.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(loadCart.fulfilled, (state, action) => {
      state.items = action.payload;
      state.status = 'idle';
    });
    builder.addCase(loadCart.rejected, (state) => {
      state.status = 'failed';
    });

    // Add to Cart
    builder.addCase(serverAddToCart.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(serverAddToCart.fulfilled, (state, action) => {
      state.items = action.payload;
      state.status = 'idle';
    });
    builder.addCase(serverAddToCart.rejected, (state) => {
      state.status = 'failed';
    });

    // Remove from Cart
    builder.addCase(serverRemoveFromCart.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(serverRemoveFromCart.fulfilled, (state, action) => {
      state.items = action.payload;
      state.status = 'idle';
    });
    builder.addCase(serverRemoveFromCart.rejected, (state) => {
      state.status = 'failed';
    });

    // Update Count
    builder.addCase(serverUpdateCount.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(serverUpdateCount.fulfilled, (state, action) => {
      state.items = action.payload;
      state.status = 'idle';
    });
    builder.addCase(serverUpdateCount.rejected, (state) => {
      state.status = 'failed';
    });
  },
});

export const { increaseQuantity, decreaseQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
