import { act, render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';

import AppWrapper from 'components/AppWrapper';
import { Journey } from 'types/journey';
import { TopSection } from 'components/LeftPanel/TopSection';
import { faker } from '@faker-js/faker';
import { useHistoryStore } from 'store/history';
import { useInputRefStore } from 'store/input-ref';
import userEvent from '@testing-library/user-event';

test('should render title', () => {
  render(<TopSection />, { wrapper: AppWrapper });
  expect(screen.getByRole('heading', { name: 'Dev Journey', level: 2 })).toBeInTheDocument();
});

test('pressing on menu button opens menu', async () => {
  const user = userEvent.setup({ delay: null });
  render(<TopSection />, { wrapper: AppWrapper });
  const button = screen.getByRole('button', { name: 'Menu' });
  expect(button).toBeInTheDocument();
  await user.click(button);
  expect(screen.getByRole('menu', { name: 'Menu' })).toBeInTheDocument();
});

test('New journey menu item is present', async () => {
  const user = userEvent.setup({ delay: null });
  render(<TopSection />, { wrapper: AppWrapper });
  const button = screen.getByRole('button', { name: 'Menu' });
  await user.click(button);
  expect(screen.getByRole('menuitem', { name: 'New journey' })).toBeInTheDocument();
});

test('Pressing new journey button focuses input ref', async () => {
  const input = document.createElement('input');
  input.focus = vi.fn();
  const user = userEvent.setup({ delay: null });
  render(<TopSection />, { wrapper: AppWrapper });

  act(() => {
    useInputRefStore.getState().setInputRef(input);
  });

  const button = screen.getByRole('button', { name: 'Menu' });
  await user.click(button);
  const menuItem = screen.getByRole('menuitem', { name: 'New journey' });
  await user.click(menuItem);
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
  render(<TopSection />, { wrapper: AppWrapper });

  act(() => {
    useHistoryStore.getState().setSelected(journey);
    useInputRefStore.getState().setInputRef(null);
  });

  const button = screen.getByRole('button', { name: 'Menu' });
  await user.click(button);
  const menuItem = screen.getByRole('menuitem', { name: 'New journey' });
  await user.click(menuItem);

  expect(useHistoryStore.getState().selected).toStrictEqual(journey);
});

test('Clear history menu item is present', async () => {
  const user = userEvent.setup({ delay: null });
  render(<TopSection />, { wrapper: AppWrapper });
  const button = screen.getByRole('button', { name: 'Menu' });
  await user.click(button);
  expect(screen.getByRole('menuitem', { name: 'Clear history' })).toBeInTheDocument();
});

test('Clear history button is disabled when there are no journeys', async () => {
  const user = userEvent.setup({ delay: null });
  render(<TopSection />, { wrapper: AppWrapper });
  const button = screen.getByRole('button', { name: 'Menu' });
  await user.click(button);
  expect(screen.getByRole('menuitem', { name: 'Clear history' })).toBeDisabled();
});

test('Clear history button is enabled when there is at least 1 journey', async () => {
  const user = userEvent.setup({ delay: null });
  render(<TopSection />, { wrapper: AppWrapper });
  const button = screen.getByRole('button', { name: 'Menu' });
  await user.click(button);

  expect(screen.getByRole('menuitem', { name: 'Clear history' })).toBeDisabled();

  act(() => {
    useHistoryStore.getState().addJourney({
      createdAt: faker.date.past().toISOString(),
      id: faker.string.uuid(),
      destinations: [],
      prompt: { label: faker.lorem.word(), value: faker.lorem.word() },
    });
  });

  expect(screen.getByRole('menuitem', { name: 'Clear history' })).toBeEnabled();
});

test('Clear history button opens a modal', async () => {
  const user = userEvent.setup({ delay: null });
  render(<TopSection />, { wrapper: AppWrapper });
  const button = screen.getByRole('button', { name: 'Menu' });
  await user.click(button);

  expect(screen.getByRole('menuitem', { name: 'Clear history' })).toBeDisabled();

  act(() => {
    useHistoryStore.getState().addJourney({
      createdAt: faker.date.past().toISOString(),
      id: faker.string.uuid(),
      destinations: [],
      prompt: { label: faker.lorem.word(), value: faker.lorem.word() },
    });
  });

  const menuItem = screen.getByRole('menuitem', { name: 'Clear history' });
  await user.click(menuItem);
  const modal = screen.getByLabelText('Confirmation', { selector: 'section[role="dialog"][aria-modal="true"]' });
  expect(modal).toBeInTheDocument();
  expect(modal.getAttribute('role')).toBe('dialog');
});
