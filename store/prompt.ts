import { ClientPrompt } from 'types/common';
import { create } from 'zustand';

export type PrompState = {
  prompt: string;
  setPrompt: (prompt: string) => void;
  prompts: ClientPrompt[];
  setPrompts: (prompts: ClientPrompt[]) => void;
};

export const usePromptStore = create<PrompState>()((set) => ({
  prompt: '',
  setPrompt: (prompt) => set(() => ({ prompt })),
  prompts: [],
  setPrompts: (prompts) => set(() => ({ prompts })),
}));
