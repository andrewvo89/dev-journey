import { create } from 'zustand';

type State = {
  isActive: boolean;
  setIsActive: (isActive: boolean) => void;
};

export const useModalStore = create<State>()((set) => ({
  isActive: false,
  setIsActive: (isActive) => set({ isActive }),
}));
