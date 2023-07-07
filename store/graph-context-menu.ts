import { create } from 'zustand';

type State = {
  menuIsOpen: string | null;
  setMenuIsOpen: (menuIsOpen: string | null) => void;
};

export const useGraphCtxMenuStore = create<State>()((set) => ({
  menuIsOpen: null,
  setMenuIsOpen: (menuIsOpen) => set({ menuIsOpen }),
}));
