import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '@/app/api/CartApi';
import { CartItem, IFlower } from '@/types/IFlower';

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
    increaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.count += 1;
    },
    decreaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (!item) return;
      if (item.count > 1) {
        item.count -= 1;
      } else {
        state.items = state.items.filter((i) => i.id !== action.payload);
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
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
