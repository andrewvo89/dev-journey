import { create } from 'zustand';

type State = {
  isOpened: string | null;
  setIsOpened: (isOpened: string | null) => void;
};

export const useContextMenuStore = create<State>()((set) => ({
  isOpened: null,
  setIsOpened: (isOpened) => set({ isOpened }),
}));
