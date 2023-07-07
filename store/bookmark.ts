import { Bookmark, BookmarkType } from 'types/bookmark';
import { bookmarkTypes, getLabel } from 'utils/bookmark';

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';

type State = {
  bookmarks: Bookmark[];
  setBookmarks: (bookmarks: Bookmark[]) => void;
  sortBookmarks: (direction: 'asc' | 'desc') => void;
  addBookmark: (bookmark: Bookmark) => void;
  removeBookmark: (id: string) => void;
  filters: BookmarkType[];
  selectAllFilters: () => void;
  selectNoFilters: () => void;
  addFilter: (type: BookmarkType) => void;
  removeFilter: (type: BookmarkType) => void;
};

export const useBookmarkStore = create<State>()(
  persist(
    immer<State>((set) => ({
      bookmarks: [],
      setBookmarks: (bookmarks) => set({ bookmarks }),
      sortBookmarks: (direction) =>
        set((state) => {
          state.bookmarks.sort((a, b) =>
            direction === 'asc' ? getLabel(a).localeCompare(getLabel(b)) : getLabel(b).localeCompare(getLabel(a)),
          );
        }),
      addBookmark: (bookmark) =>
        set((state) => {
          const found = state.bookmarks.find((b) => b.id === bookmark.id);
          if (!found) {
            state.bookmarks.push(bookmark);
          }
        }),
      removeBookmark: (id) =>
        set((state) => {
          const foundIndex = state.bookmarks.findIndex((b) => b.id === id);
          if (foundIndex !== -1) {
            state.bookmarks.splice(foundIndex, 1);
          }
        }),
      filters: bookmarkTypes,
      selectAllFilters: () => set({ filters: bookmarkTypes }),
      selectNoFilters: () => set({ filters: [] }),
      addFilter: (type) =>
        set((state) => {
          const foundIndex = state.filters.findIndex((f) => f === type);
          if (foundIndex === -1) {
            state.filters.push(type);
          }
        }),
      removeFilter: (type) =>
        set((state) => {
          const foundIndex = state.filters.findIndex((f) => f === type);
          if (foundIndex !== -1) {
            state.filters.splice(foundIndex, 1);
          }
        }),
    })),
    { name: 'bookmarks', partialize: (state) => ({ bookmarks: state.bookmarks, filters: state.filters }), version: 1 },
  ),
);
