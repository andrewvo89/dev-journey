import { ImportType } from 'types/import-export';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { importTypes } from 'utils/import-export';

type State = {
  importTypes: ImportType[];
  selectImportType: (importTypes: ImportType) => void;
  deselectImportType: (importTypes: ImportType) => void;
  selectAllImportTypes: () => void;
  deselectAllImportTypes: () => void;
  exportTypes: ImportType[];
  selectExportType: (exportTypes: ImportType) => void;
  deselectExportType: (exportTypes: ImportType) => void;
  selectAllExportTypes: () => void;
  deselectAllExportTypes: () => void;
};

export const useImportExportStore = create<State>()(
  immer<State>((set) => ({
    importTypes,
    selectImportType: (importType) =>
      set((state) => {
        const foundIndex = state.importTypes.indexOf(importType);
        if (foundIndex === -1) {
          state.importTypes.push(importType);
        }
      }),
    deselectImportType: (importType) =>
      set((state) => {
        const foundIndex = state.importTypes.indexOf(importType);
        if (foundIndex !== -1) {
          state.importTypes.splice(foundIndex, 1);
        }
      }),
    selectAllImportTypes: () => set({ importTypes }),
    deselectAllImportTypes: () => set({ importTypes: [] }),
    exportTypes: importTypes,
    selectExportType: (exportType) =>
      set((state) => {
        const foundIndex = state.exportTypes.indexOf(exportType);
        if (foundIndex === -1) {
          state.exportTypes.push(exportType);
        }
      }),
    deselectExportType: (exportType) =>
      set((state) => {
        const foundIndex = state.exportTypes.indexOf(exportType);
        if (foundIndex !== -1) {
          state.exportTypes.splice(foundIndex, 1);
        }
      }),
    selectAllExportTypes: () => set({ exportTypes: importTypes }),
    deselectAllExportTypes: () => set({ exportTypes: [] }),
  })),
);
