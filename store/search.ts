import { create } from 'zustand';

type SearchState = {
  prompt: string;
  setPrompt: (term: string) => void;
};

export const usePromptStore = create<SearchState>()((set) => ({
  prompt: '',
  setPrompt: (prompt: string) => set(() => ({ prompt })),
}));
