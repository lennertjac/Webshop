import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  grade: string;
  condition: string;
}

interface CartStore {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      cartItems: [],
      total: 0,

      addToCart: (item) => {
        set((state) => {
          const existingItem = state.cartItems.find((i) => i.id === item.id);
          let newItems;

          if (existingItem) {
            // If item already in cart, increment quantity
            newItems = state.cartItems.map((i) =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            );
          } else {
            // Add new item to cart
            newItems = [...state.cartItems, item];
          }

          // Calculate total
          const newTotal = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

          return {
            cartItems: newItems,
            total: newTotal,
          };
        });
      },

      removeFromCart: (itemId) => {
        set((state) => {
          const newItems = state.cartItems.filter((i) => i.id !== itemId);
          const newTotal = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
          return {
            cartItems: newItems,
            total: newTotal,
          };
        });
      },

      updateQuantity: (itemId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return get().removeFromCart(itemId), { cartItems: state.cartItems, total: state.total };
          }

          const newItems = state.cartItems.map((i) =>
            i.id === itemId ? { ...i, quantity } : i
          );
          const newTotal = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

          return {
            cartItems: newItems,
            total: newTotal,
          };
        });
      },

      clearCart: () => {
        set({
          cartItems: [],
          total: 0,
        });
      },
    }),
    {
      name: 'cart-storage', // localStorage key
    }
  )
);
