import { create } from 'zustand';

type State = {
  isOpen: string | null;
  setIsOpen: (menuIsOpen: string | null) => void;
};

export const useBookmarkCtxMenuStore = create<State>()((set) => ({
  isOpen: null,
  setIsOpen: (isOpen) => set({ isOpen }),
}));
