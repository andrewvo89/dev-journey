import { create } from 'zustand';

type InputRefState = {
  inputRef: HTMLInputElement | null;
  setInputRef: (inputRef: HTMLInputElement | null) => void;
};

export const useInputRefStore = create<InputRefState>()((set) => ({
  inputRef: null,
  setInputRef: (inputRef) => set({ inputRef }),
}));
