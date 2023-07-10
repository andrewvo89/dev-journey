import { ChangeEvent, useMemo } from 'react';
import { Checkbox, Stack } from '@mantine/core';
import { bookmarkTypes, getPrettyType } from 'utils/bookmark';

import { BookmarkType } from 'types/bookmark';
import { bookmarkTypeSchema } from 'schemas/bookmark';
import { shallow } from 'zustand/shallow';
import { useBookmarkStore } from 'store/bookmark';

export function FiltersChooser() {
  const { filters, addFilter, removeFilter, selectAllFilters, selectNoFilters } = useBookmarkStore(
    (state) => ({
      filters: state.filters,
      addFilter: state.selectFilter,
      removeFilter: state.deselectFilter,
      selectAllFilters: state.selectAllFilters,
      selectNoFilters: state.deselectAllFilters,
    }),
    shallow,
  );
  const bookmarks = useBookmarkStore((state) => state.bookmarks);
  const counts = useMemo<Record<BookmarkType, number>>(
    () =>
      bookmarks.reduce(
        (map, bookmark) => ({ ...map, [bookmark.type]: map[bookmark.type] + 1 }),
        bookmarkTypes.reduce<Record<string, number>>((map, type) => ({ ...map, [type]: 0 }), {}),
      ),
    [bookmarks],
  );

  const allChecked = bookmarkTypes.every((type) => filters.includes(type));
  const indeterminate = bookmarkTypes.some((type) => filters.includes(type)) && !allChecked;

  const childCheckboxChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const parsed = bookmarkTypeSchema.safeParse(e.currentTarget.value);
    if (!parsed.success) {
      return;
    }
    if (e.currentTarget.checked) {
      addFilter(parsed.data);
    } else {
      removeFilter(parsed.data);
    }
  };

  const parentCheckboxChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.checked) {
      selectAllFilters();
    } else {
      selectNoFilters();
    }
  };

  return (
    <Stack>
      <Checkbox
        label='Select all'
        checked={allChecked}
        indeterminate={indeterminate}
        onChange={parentCheckboxChangeHandler}
      />
      {bookmarkTypes.map((type) => (
        <Checkbox
          key={type}
          ml='xl'
          value={type}
          label={`${getPrettyType(type)} (${counts[type]})`}
          checked={filters.includes(type)}
          onChange={childCheckboxChangeHandler}
        />
      ))}
    </Stack>
  );
}
