import { Checkbox, Stack } from '@mantine/core';
import { bookmarkTypes, getPrettyType } from 'utils/bookmark';

import { ChangeEvent } from 'react';
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
          label={getPrettyType(type)}
          checked={filters.includes(type)}
          onChange={childCheckboxChangeHandler}
        />
      ))}
    </Stack>
  );
}
