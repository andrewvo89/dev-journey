import { TabKey } from 'components/LeftPanel';
import { create } from 'zustand';

type State = {
  tab: TabKey;
  setTab: (tab: TabKey) => void;
};

export const useTabStore = create<State>()((set) => ({
  tab: 'history',
  setTab: (tab) => set({ tab }),
}));
