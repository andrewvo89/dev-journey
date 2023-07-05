import { act, render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';

import AppWrapper from 'components/AppWrapper';
import { Journey } from 'types/common';
import { MiddleSection } from 'components/LeftPanel/MiddleSection';
import { faker } from '@faker-js/faker';
import { useHistoryStore } from 'store/history';
import { useInputRefStore } from 'store/input-ref';
import userEvent from '@testing-library/user-event';

test('renders a ket accordian heading', () => {
  render(<MiddleSection />, { wrapper: AppWrapper });
  expect(screen.getByRole('button', { name: 'Key' })).toBeInTheDocument();
});

test('ket accordian is not expanded by default', () => {
  render(<MiddleSection />);
  const heading = screen.getByRole('button', { name: 'Key' });
  expect(heading.getAttribute('aria-expanded')).toBe('false');
  expect(screen.queryByRole('region', { name: 'Key' })).toBeNull();
});

test('ket accordian is expanded when clicked on', async () => {
  const user = userEvent.setup({ delay: null });
  render(<MiddleSection />, { wrapper: AppWrapper });
  const heading = screen.getByRole('button', { name: 'Key' });
  expect(heading.getAttribute('aria-expanded')).toBe('false');

  let byLabelText = await screen.findAllByLabelText('Key');
  let filtered = byLabelText.filter(
    (el) => el.getAttribute('role') === 'region' && el.getAttribute('aria-hidden') === 'true',
  );
  expect(filtered.length).toBe(1);

  await user.click(heading);
  expect(heading.getAttribute('aria-expanded')).toBe('true');
  byLabelText = await screen.findAllByLabelText('Key');
  filtered = byLabelText.filter(
    (el) => el.getAttribute('role') === 'region' && el.getAttribute('aria-hidden') === 'true',
  );

  expect(filtered.length).toBe(0);
});

test('renders a history accordian heading', () => {
  render(<MiddleSection />, { wrapper: AppWrapper });
  expect(screen.getByRole('button', { name: 'History' })).toBeInTheDocument();
});

test('history accordian is expanded by default', () => {
  render(<MiddleSection />, { wrapper: AppWrapper });
  const heading = screen.getByRole('button', { name: 'History' });
  expect(heading.getAttribute('aria-expanded')).toBe('true');
  expect(screen.queryByRole('region', { name: 'History' })).toBeInTheDocument();
});

test('history accordian is not expanded when clicked on', async () => {
  const user = userEvent.setup({ delay: null });
  render(<MiddleSection />, { wrapper: AppWrapper });
  const heading = screen.getByRole('button', { name: 'History' });
  expect(heading.getAttribute('aria-expanded')).toBe('true');

  let byLabelText = await screen.findAllByLabelText('History');
  let filtered = byLabelText.filter(
    (el) => el.getAttribute('role') === 'region' && el.getAttribute('aria-hidden') === 'true',
  );
  expect(filtered.length).toBe(0);

  await user.click(heading);
  expect(heading.getAttribute('aria-expanded')).toBe('false');
  byLabelText = await screen.findAllByLabelText('History');
  filtered = byLabelText.filter(
    (el) => el.getAttribute('role') === 'region' && el.getAttribute('aria-hidden') === 'true',
  );

  expect(filtered.length).toBe(1);
});

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
