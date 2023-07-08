import { ClientPrompt } from 'types/journey';
import { create } from 'zustand';

export type State = {
  prompt: string;
  setPrompt: (prompt: string) => void;
  prompts: ClientPrompt[];
  setPrompts: (prompts: ClientPrompt[]) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
};

export const usePromptStore = create<State>()((set) => ({
  prompt: '',
  setPrompt: (prompt) => set(() => ({ prompt })),
  prompts: [],
  setPrompts: (prompts) => set(() => ({ prompts })),
  isLoading: false,
  setIsLoading: (isLoading) => set(() => ({ isLoading })),
}));
