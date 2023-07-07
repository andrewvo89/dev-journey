import { Journey } from 'types/journey';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type State = {
  journeys: Journey[];
  setJourneys: (journeys: Journey[]) => void;
  addJourney: (journey: Journey) => void;
  removeJourney: (journey: Journey) => void;
  selectPath: (journey: Journey, pathId: string) => void;
  deselectPath: (journey: Journey, pathId: string) => void;
  selected: Journey | null;
  setSelected: (journey: Journey | null) => void;
  clearHistory: () => void;
};

export const useHistoryStore = create<State>()(
  persist(
    (set) => ({
      journeys: [],
      setJourneys: (journeys) => set({ journeys }),
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
      selectPath: (journey, pathId) =>
        set((state) => {
          const newDesPaths = journey.destinations.map((path) =>
            path.id === pathId ? { ...path, enabled: true } : path,
          );
          const newJourney: Journey = { ...journey, destinations: newDesPaths };
          const newJourneys = state.journeys.map((j) => (j.id === journey.id ? newJourney : j));
          const newSelected = state.selected?.id === newJourney.id ? newJourney : state.selected;
          return { journeys: newJourneys, selected: newSelected };
        }),
      deselectPath: (journey, pathId) =>
        set((state) => {
          const newDesPaths = journey.destinations.map((path) =>
            path.id === pathId ? { ...path, enabled: false } : path,
          );
          const newJourney: Journey = { ...journey, destinations: newDesPaths };
          const newJourneys = state.journeys.map((j) => (j.id === journey.id ? newJourney : j));
          const newSelected = state.selected?.id === newJourney.id ? newJourney : state.selected;
          return { journeys: newJourneys, selected: newSelected };
        }),
      selected: null,
      setSelected: (selected) => set({ selected }),
      clearHistory: () => set({ journeys: [], selected: null }),
    }),
    { name: 'history', partialize: (state) => ({ journeys: state.journeys }), version: 1 },
  ),
);
