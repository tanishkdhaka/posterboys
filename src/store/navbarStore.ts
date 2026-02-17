
import { create } from "zustand"
import { persist } from "zustand/middleware"

type CartItem = {
  id: number,
  size:string,
  quantity: number
}

type CartState = {
  items: CartItem[]
  addItem: (id: number, size:string, quantity:number) => void
  removeItem: (id: number,size:string) => void
  totalItems: () => number
  reduceQuantity:(id:number,size:string)=>void
}

export const useCartStore = create<CartState>()(
    persist(
      (set,get) => ({
        items: [],
  
        addItem: (id,size,quantity) =>
          set((state) => {
            const existing = state.items.find((item) => item.id === id && item.size ===size)
  
            if (existing) {
              return {
                items: state.items.map((item) =>
                 item.id === id && item.size === size
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
                ),
              }
            }
  
            return {
              items: [...state.items, { id,size, quantity: quantity }],
            }
          }),
          reduceQuantity: (id: number, size: string) =>
            set((state: CartState) => {
                const existing = state.items.find((item) => item.id === id && item.size === size);
                if (existing) {
                    return {
                        items: state.items.map((item) =>
                            item.id === id && item.size === size
                                ? { ...item, quantity: item.quantity - 1 }
                                : item
                        ),
                    };
                }
                return state;
            }),
          removeItem: (id,size) =>
                set((state) => ({
                  items: state.items.filter((item) => item.id !== id || item.size !== size) ,
                })),
            
              totalItems: () =>
                get().items.reduce((acc, item) => acc + item.quantity, 0),
      }),
      {
        name: "cart-storage", // key in localStorage
      }
    )
  )

