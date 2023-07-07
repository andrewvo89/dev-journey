import { ClientPrompt } from 'types/journey';
import { create } from 'zustand';

export type State = {
  prompt: string;
  setPrompt: (prompt: string) => void;
  prompts: ClientPrompt[];
  setPrompts: (prompts: ClientPrompt[]) => void;
};

export const usePromptStore = create<State>()((set) => ({
  prompt: '',
  setPrompt: (prompt) => set(() => ({ prompt })),
  prompts: [],
  setPrompts: (prompts) => set(() => ({ prompts })),
}));
