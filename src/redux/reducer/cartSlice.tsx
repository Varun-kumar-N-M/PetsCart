import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: string;
  imageUrl: string;
  addedAt: string;
  petName?: string;
  breed?: string;
  age?: number;
  price?: number;
}
export interface Pet {
  id: string;
  petName: string;
  breed: string;
  age: number;
  price: number;
  imageUrl: string;
  createdAt: string;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  pets: Pet[];
  currentIndex: number;
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  pets: [],
  currentIndex: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      state.items.push(action.payload);
      state.totalItems = state.items.length;
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.totalItems = state.items.length;
    },
    clearCart: state => {
      state.items = [];
      state.totalItems = 0;
    },
    addPet: (state, action: PayloadAction<Pet>) => {
      state.pets.push(action.payload);
    },
    removePet: (state, action: PayloadAction<string>) => {
      state.pets = state.pets.filter(pet => pet.id !== action.payload);
      if (state.currentIndex >= state.pets.length) {
        state.currentIndex = Math.max(0, state.pets.length - 1);
      }
    },
    updatePetImage: (
      state,
      action: PayloadAction<{ id: string; imageUrl: string }>,
    ) => {
      const pet = state.pets.find(p => p.id === action.payload.id);
      if (pet) {
        pet.imageUrl = action.payload.imageUrl;
      }
    },
    nextPet: state => {
      if (state.pets.length > 0) {
        state.currentIndex = (state.currentIndex + 1) % state.pets.length;
      }
    },
    previousPet: state => {
      if (state.pets.length > 0) {
        state.currentIndex =
          state.currentIndex === 0
            ? state.pets.length - 1
            : state.currentIndex - 1;
      }
    },
    setCurrentIndex: (state, action: PayloadAction<number>) => {
      if (action.payload >= 0 && action.payload < state.pets.length) {
        state.currentIndex = action.payload;
      }
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  addPet,
  removePet,
  updatePetImage,
  nextPet,
  previousPet,
  setCurrentIndex,
} = cartSlice.actions;
export default cartSlice.reducer;
