import { create } from 'zustand';

type State = {
  inputRef: HTMLInputElement | null;
  setInputRef: (inputRef: HTMLInputElement | null) => void;
};

export const useInputRefStore = create<State>()((set) => ({
  inputRef: null,
  setInputRef: (inputRef) => set({ inputRef }),
}));
