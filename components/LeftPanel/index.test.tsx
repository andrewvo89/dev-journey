import { act, render, screen } from '@testing-library/react';

import AppWrapper from 'components/AppWrapper';
import LeftPanel from 'components/LeftPanel';
import { faker } from '@faker-js/faker';
import { test } from 'vitest';
import { useHistoryStore } from 'store/history';
import userEvent from '@testing-library/user-event';

test('navigation renders', () => {
  render(<LeftPanel />, { wrapper: AppWrapper });
  expect(screen.getByRole('navigation', { name: 'Sidebar' })).toBeInTheDocument();
});

test('top section renders', () => {
  render(<LeftPanel />, { wrapper: AppWrapper });
  expect(screen.getByRole('region', { name: 'Top section' })).toBeInTheDocument();
});

test('middle section renders', () => {
  render(<LeftPanel />, { wrapper: AppWrapper });
  expect(screen.getByRole('region', { name: 'Middle section' })).toBeInTheDocument();
});

test('bottom section renders', () => {
  render(<LeftPanel />, { wrapper: AppWrapper });
  expect(screen.getByRole('region', { name: 'Bottom section' })).toBeInTheDocument();
});

test('selected journey is removed after clicking outside', async () => {
  const user = userEvent.setup({ delay: null });
  const prompt = faker.lorem.sentence();
  act(() => {
    useHistoryStore.getState().setSelected({
      createdAt: faker.date.past().toISOString(),
      destinations: [],
      id: faker.string.uuid(),
      prompt: { label: prompt, value: prompt },
    });
  });
  render(<LeftPanel />, { wrapper: AppWrapper });
  expect(useHistoryStore.getState().selected).not.toBe(null);
  await user.click(screen.getByRole('region', { name: 'Middle section' }));
  expect(useHistoryStore.getState().selected).toBe(null);
});