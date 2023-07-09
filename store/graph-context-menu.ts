import { create } from 'zustand';

type State = {
  isOpen: string | null;
  setIsOpen: (isOpen: string | null) => void;
};

export const useGraphCtxMenuStore = create<State>()((set) => ({
  isOpen: null,
  setIsOpen: (isOpen) => set({ isOpen }),
}));
