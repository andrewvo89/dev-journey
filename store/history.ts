import { Journey } from 'types/common';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type HistoryState = {
  journeys: Journey[];
  addJourney: (journey: Journey) => void;
  removeJourney: (journey: Journey) => void;
  setJourney: (journey: Journey) => void;
  selected: Journey | null;
  setSelected: (journey: Journey) => void;
};

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      journeys: [],
      addJourney: (journey: Journey) =>
        set((state) => {
          const firstJourney = state.journeys.at(0);
          const isSamePrompt = firstJourney?.prompt.value === journey.prompt.value;
          if (isSamePrompt) {
            return { selected: firstJourney };
          }

          return { journeys: [journey, ...state.journeys], selected: journey };
        }),
      removeJourney: (journey: Journey) =>
        set((state) => ({ journeys: state.journeys.filter((j) => j.id !== journey.id), selected: null })),
      setJourney: (journey: Journey) =>
        set((state) => ({ journeys: state.journeys.map((j) => (j.id === journey.id ? journey : j)) })),
      selected: null,
      setSelected: (selected) => set({ selected }),
    }),
    {
      name: 'history',
      partialize: (state) => ({
        journeys: state.journeys,
      }),
      version: 1,
    },
  ),
);
