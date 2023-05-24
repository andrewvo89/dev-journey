import { Journey } from 'types/common';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type HistoryState = {
  journeys: Journey[];
  addJourney: (journey: Journey) => void;
  removeJourney: (journey: Journey) => void;
  setJourney: (journey: Journey) => void;
  selectPath: (journey: Journey, path: string) => void;
  deselectPath: (journey: Journey, path: string) => void;
  selected: Journey | null;
  setSelected: (journey: Journey | null) => void;
  clearHistory: () => void;
};

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      journeys: [],
      addJourney: (journey) =>
        set((state) => {
          const firstJourney = state.journeys.at(0);
          const isSamePrompt = firstJourney?.prompt.value === journey.prompt.value;
          if (isSamePrompt) {
            return { selected: firstJourney };
          }

          return { journeys: [journey, ...state.journeys], selected: journey };
        }),
      removeJourney: (journey) =>
        set((state) => ({ journeys: state.journeys.filter((j) => j.id !== journey.id), selected: null })),
      setJourney: (journey) =>
        set((state) => ({ journeys: state.journeys.map((j) => (j.id === journey.id ? journey : j)) })),
      selectPath: (journey, path) =>
        set((state) => {
          const newPaths = Object.entries(journey.paths).reduce(
            (obj, [key, value]) => ({ ...obj, [key]: path === key ? true : value }),
            {},
          );
          const newJourney = { ...journey, paths: newPaths };
          const newJourneys = state.journeys.map((j) => (j.id === journey.id ? newJourney : j));
          const newSelected = state.selected?.id === newJourney.id ? newJourney : state.selected;
          return { journeys: newJourneys, selected: newSelected };
        }),
      deselectPath: (journey, path) =>
        set((state) => {
          const newPaths = Object.entries(journey.paths).reduce(
            (obj, [key, value]) => ({ ...obj, [key]: path === key ? false : value }),
            {},
          );
          const newJourney = { ...journey, paths: newPaths };
          const newJourneys = state.journeys.map((j) => (j.id === journey.id ? newJourney : j));
          const newSelected = state.selected?.id === newJourney.id ? newJourney : state.selected;
          return { journeys: newJourneys, selected: newSelected };
        }),
      selected: null,
      setSelected: (selected) => set({ selected }),
      clearHistory: () => set({ journeys: [], selected: null }),
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
