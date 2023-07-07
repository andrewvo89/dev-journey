import { act, render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';

import AppWrapper from 'components/AppWrapper';
import HistoryListItem from 'components/LeftPanel/HistoryListItem';
import { Journey } from 'types/journey';
import dayjs from 'dayjs';
import { faker } from '@faker-js/faker';
import { mockJnodes } from 'tests/mock-data';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useHistoryStore } from 'store/history';
import { useNodeStore } from 'store/node';
import userEvent from '@testing-library/user-event';

dayjs.extend(relativeTime);

const prompt = faker.lorem.sentence();
const journey: Journey = {
  createdAt: faker.date.past().toISOString(),
  destinations: [
    { id: faker.string.uuid(), enabled: true },
    { id: faker.string.uuid(), enabled: true },
  ],
  id: faker.string.uuid(),
  prompt: { label: prompt, value: prompt },
};

test('renders list item', () => {
  render(<HistoryListItem journey={journey} />, { wrapper: AppWrapper });
  expect(screen.getByRole('menuitem', { name: 'History item' })).toBeInTheDocument();
});

test('ui shows that item is selected', () => {
  render(<HistoryListItem journey={journey} />, { wrapper: AppWrapper });
  const listItem = screen.getByRole('menuitem', { name: 'History item' });

  expect(listItem).not.toHaveAttribute('data-active', 'true');
  expect(screen.queryByRole('button', { name: 'Delete history item' })).not.toBeInTheDocument();

  act(() => {
    useHistoryStore.getState().setSelected(journey);
  });

  expect(listItem).toHaveAttribute('data-active', 'true');
  expect(screen.queryByRole('button', { name: 'Delete history item' })).toBeInTheDocument();
});

test('relative time is shown', () => {
  render(<HistoryListItem journey={journey} />, { wrapper: AppWrapper });
  expect(screen.getByText(dayjs().to(dayjs(journey.createdAt)))).toBeInTheDocument();
});

test('relative time is updated after 60 seconds', () => {
  vi.useFakeTimers();
  render(<HistoryListItem journey={journey} />, { wrapper: AppWrapper });

  act(() => {
    vi.advanceTimersByTime(600000);
  });
  expect(screen.getByText(dayjs().to(dayjs(journey.createdAt)))).toBeInTheDocument();
  vi.useRealTimers();
});

test('journey prompt is shown', () => {
  render(<HistoryListItem journey={journey} />, { wrapper: AppWrapper });

  act(() => {
    useHistoryStore.getState().setSelected(journey);
  });

  expect(screen.queryByRole('term', { name: (_, element) => element.textContent === prompt })).toBeInTheDocument();
});

test('journey is selected when clicked on', async () => {
  const user = userEvent.setup({ delay: null });

  render(<HistoryListItem journey={journey} />, { wrapper: AppWrapper });
  const listItem = screen.getByRole('menuitem', { name: 'History item' });
  expect(listItem).not.toHaveAttribute('data-active', 'true');

  expect(useHistoryStore.getState().selected).not.toBe(journey);

  await user.click(listItem);
  expect(listItem).toHaveAttribute('data-active', 'true');
  expect(useHistoryStore.getState().selected).toBe(journey);
});

test('journey does not expand when there is 1 or less destinations', async () => {
  const user = userEvent.setup({ delay: null });

  render(<HistoryListItem journey={{ ...journey, destinations: [journey.destinations[0]] }} />, {
    wrapper: AppWrapper,
  });

  expect(screen.getByRole('menuitem', { name: 'History item' })).toHaveAttribute('aria-expanded', 'false');
  await user.click(screen.getByRole('menuitem', { name: 'History item' }));

  expect(screen.getByRole('menuitem', { name: 'History item' })).toHaveAttribute('aria-expanded', 'false');
  expect(screen.queryByLabelText('Destinations', { selector: 'div[role="region"]' })).not.toBeInTheDocument();
});

test('journey is expanded when clicked on', async () => {
  const user = userEvent.setup({ delay: null });

  act(() => {
    useNodeStore.getState().initFlow(mockJnodes, [], []);
  });

  render(
    <HistoryListItem
      journey={{
        ...journey,
        destinations: mockJnodes
          .filter((jnode) => jnode.type !== 'root')
          .map((jnode) => ({ id: jnode.id, enabled: true })),
      }}
    />,
    { wrapper: AppWrapper },
  );

  expect(screen.getByRole('menuitem', { name: 'History item' })).toHaveAttribute('aria-expanded', 'false');
  await user.click(screen.getByRole('menuitem', { name: 'History item' }));

  expect(screen.getByRole('menuitem', { name: 'History item' })).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByLabelText('Destinations', { selector: 'div[role="region"]' })).toBeInTheDocument();
});

test('if journey is already seletected, nothing happens when clicked on', async () => {
  const user = userEvent.setup({ delay: null });
  render(<HistoryListItem journey={journey} />, { wrapper: AppWrapper });

  act(() => {
    useHistoryStore.getState().setSelected(journey);
  });
  const listItem = screen.getByRole('menuitem', { name: 'History item' });
  expect(listItem).toHaveAttribute('data-active', 'true');

  await user.click(listItem);
  expect(listItem).toHaveAttribute('data-active', 'true');
});

test('delete mode is enabled on delete button click', async () => {
  const user = userEvent.setup({ delay: null });

  act(() => {
    useHistoryStore.getState().setSelected(journey);
  });
  render(<HistoryListItem journey={journey} />, { wrapper: AppWrapper });
  expect(screen.queryByRole('button', { name: 'Confirm delete' })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Cancel delete' })).not.toBeInTheDocument();

  const button = screen.getByRole('button', { name: 'Delete history item' });
  await user.click(button);
  expect(screen.queryByRole('button', { name: 'Confirm delete' })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Cancel delete' })).toBeInTheDocument();
});

test('history item is deleted when confirmed', async () => {
  const user = userEvent.setup({ delay: null });

  act(() => {
    useHistoryStore.getState().addJourney(journey);
  });
  render(<HistoryListItem journey={journey} />, { wrapper: AppWrapper });

  const deleteButton = screen.getByRole('button', { name: 'Delete history item' });
  await user.click(deleteButton);
  const confirmButton = screen.getByRole('button', { name: 'Confirm delete' });

  const listItem = screen.getByRole('menuitem', { name: 'History item' });

  expect(listItem).toHaveAttribute('data-active', 'true');
  expect(useHistoryStore.getState().journeys).toHaveLength(1);
  expect(useHistoryStore.getState().journeys[0]).toBe(journey);

  await user.click(confirmButton);

  expect(listItem).not.toHaveAttribute('data-active', 'true');
  expect(useHistoryStore.getState().journeys).toHaveLength(0);
});

test('history item is not deleted when cancelled', async () => {
  const user = userEvent.setup({ delay: null });

  act(() => {
    useHistoryStore.getState().addJourney(journey);
  });
  render(<HistoryListItem journey={journey} />, { wrapper: AppWrapper });

  const deleteButton = screen.getByRole('button', { name: 'Delete history item' });
  await user.click(deleteButton);

  const listItem = screen.getByRole('menuitem', { name: 'History item' });

  expect(listItem).toHaveAttribute('data-active', 'true');
  expect(useHistoryStore.getState().journeys).toHaveLength(1);
  expect(useHistoryStore.getState().journeys[0]).toBe(journey);
  expect(screen.queryByRole('button', { name: 'Confirm delete' })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Cancel delete' })).toBeInTheDocument();

  const confirmButton = screen.getByRole('button', { name: 'Cancel delete' });
  await user.click(confirmButton);

  expect(listItem).toHaveAttribute('data-active', 'true');
  expect(useHistoryStore.getState().journeys).toHaveLength(1);
  expect(useHistoryStore.getState().journeys[0]).toBe(journey);
  expect(screen.queryByRole('button', { name: 'Confirm delete' })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Cancel delete' })).not.toBeInTheDocument();
});

test('journey is expanded when clicked on', async () => {
  const user = userEvent.setup({ delay: null });

  render(<HistoryListItem journey={journey} />, { wrapper: AppWrapper });

  expect(screen.getByRole('menuitem', { name: 'History item' })).toHaveAttribute('aria-expanded', 'false');
  await user.click(screen.getByRole('menuitem', { name: 'History item' }));

  expect(screen.getByRole('menuitem', { name: 'History item' })).toHaveAttribute('aria-expanded', 'true');
});

test('all destinations are checked by default', async () => {
  const user = userEvent.setup({ delay: null });
  const destinations = mockJnodes
    .filter((jnode) => jnode.type !== 'root')
    .map((jnode) => ({ id: jnode.id, enabled: true }));

  act(() => {
    useNodeStore.getState().initFlow(mockJnodes, [], []);
  });

  render(<HistoryListItem journey={{ ...journey, destinations }} />, { wrapper: AppWrapper });

  await user.click(screen.getByRole('menuitem', { name: 'History item' }));

  destinations.forEach((destination) => {
    expect(screen.getByDisplayValue(destination.id)).toBeChecked();
  });
});

test('destination is toggled on and toggled off', async () => {
  const user = userEvent.setup({ delay: null });
  const destinations = mockJnodes
    .filter((jnode) => jnode.type !== 'root')
    .map((jnode) => ({ id: jnode.id, enabled: true }));

  const newJourney: Journey = { ...journey, destinations };
  act(() => {
    useNodeStore.getState().initFlow(mockJnodes, [], []);
    useHistoryStore.getState().addJourney(newJourney);
  });

  const { rerender } = render(<HistoryListItem journey={useHistoryStore.getState().journeys[0]} />, {
    wrapper: AppWrapper,
  });
  await user.click(screen.getByRole('menuitem', { name: 'History item' }));

  let switchInput = screen.getByLabelText(mockJnodes[1].title, {
    selector: 'input[type="checkbox"][role="switch"]',
  });
  expect(switchInput).toBeChecked();

  await userEvent.click(switchInput);

  rerender(<HistoryListItem journey={useHistoryStore.getState().journeys[0]} />);
  switchInput = screen.getByLabelText(mockJnodes[1].title, {
    selector: 'input[type="checkbox"][role="switch"]',
  });
  expect(switchInput).not.toBeChecked();

  await userEvent.click(switchInput);

  rerender(<HistoryListItem journey={useHistoryStore.getState().journeys[0]} />);
  switchInput = screen.getByLabelText(mockJnodes[1].title, {
    selector: 'input[type="checkbox"][role="switch"]',
  });
  expect(switchInput).toBeChecked();
});
