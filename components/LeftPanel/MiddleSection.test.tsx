import { act, render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';

import AppWrapper from 'components/AppWrapper';
import { Journey } from 'types/journey';
import { MiddleSection } from 'components/LeftPanel/MiddleSection';
import { faker } from '@faker-js/faker';
import { useHistoryStore } from 'store/history';
import { useInputRefStore } from 'store/input-ref';
import userEvent from '@testing-library/user-event';

test('New journey button is present when there are no journeys', async () => {
  render(<MiddleSection />, { wrapper: AppWrapper });
  const button = screen.getByRole('button', { name: 'Start new journey' });
  expect(button).toBeInTheDocument();
});

test('New journey button not is present when there are journeys', async () => {
  render(<MiddleSection />, { wrapper: AppWrapper });
  const journey: Journey = {
    createdAt: faker.date.past().toISOString(),
    id: faker.string.uuid(),
    destinations: [],
    prompt: { label: faker.lorem.word(), value: faker.lorem.word() },
  };
  act(() => {
    useHistoryStore.getState().addJourney(journey);
  });
  render(<MiddleSection />, { wrapper: AppWrapper });
  const button = screen.queryByRole('button', { name: 'Start new journey' });
  expect(button).toBeNull();
});

test('Pressing new journey button focuses input ref', async () => {
  const input = document.createElement('input');
  input.focus = vi.fn();
  const user = userEvent.setup({ delay: null });
  render(<MiddleSection />, { wrapper: AppWrapper });

  act(() => {
    useInputRefStore.getState().setInputRef(input);
  });

  const button = screen.getByRole('button', { name: 'Start new journey' });
  await user.click(button);

  expect(input.focus).toHaveBeenCalledTimes(1);
  expect(useHistoryStore.getState().selected).toBeNull();
});

test('Pressing new journey button doesnt focus when ref is not assigned yet', async () => {
  const journey: Journey = {
    createdAt: faker.date.past().toISOString(),
    id: faker.string.uuid(),
    destinations: [],
    prompt: { label: faker.lorem.word(), value: faker.lorem.word() },
  };
  const user = userEvent.setup({ delay: null });
  render(<MiddleSection />, { wrapper: AppWrapper });

  act(() => {
    useHistoryStore.getState().setSelected(journey);
    useInputRefStore.getState().setInputRef(null);
  });

  const button = screen.getByRole('button', { name: 'Start new journey' });
  await user.click(button);

  expect(useHistoryStore.getState().selected).toStrictEqual(journey);
});
