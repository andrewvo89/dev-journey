import { Bookmark, BookmarkFilter, BookmarkSort } from 'types/bookmark';

import { bookmarkTypes } from 'utils/bookmark';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';

type State = {
  bookmarks: Bookmark[];
  setBookmarks: (bookmarks: Bookmark[]) => void;
  addBookmark: (bookmark: Bookmark) => void;
  removeBookmark: (id: string) => void;
  filters: BookmarkFilter[];
  setFilters: (filters: BookmarkFilter[]) => void;
  selectAllFilters: () => void;
  deselectAllFilters: () => void;
  selectFilter: (type: BookmarkFilter) => void;
  deselectFilter: (type: BookmarkFilter) => void;
  sort: BookmarkSort;
  setSort: (sort: BookmarkSort) => void;
};

export const useBookmarkStore = create<State>()(
  persist(
    immer<State>((set) => ({
      bookmarks: [],
      setBookmarks: (bookmarks) => set({ bookmarks }),
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
      setFilters: (filters) => set({ filters }),
      selectAllFilters: () => set({ filters: bookmarkTypes }),
      deselectAllFilters: () => set({ filters: [] }),
      selectFilter: (type) =>
        set((state) => {
          const foundIndex = state.filters.indexOf(type);
          if (foundIndex === -1) {
            state.filters.push(type);
          }
        }),
      deselectFilter: (type) =>
        set((state) => {
          const foundIndex = state.filters.indexOf(type);
          if (foundIndex !== -1) {
            state.filters.splice(foundIndex, 1);
          }
        }),
      sort: 'none',
      setSort: (sort) => set({ sort }),
    })),
    {
      name: 'bookmarks',
      partialize: (state) => ({ bookmarks: state.bookmarks, filters: state.filters, sort: state.sort }),
      version: 1,
    },
  ),
);
