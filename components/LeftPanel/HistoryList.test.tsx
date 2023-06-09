import * as useHydratedStore from 'hooks/useHydratedStore';

import { expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import AppWrapper from 'components/AppWrapper';
import HistoryList from 'components/LeftPanel/HistoryList';
import { Journey } from 'types/common';
import { faker } from '@faker-js/faker';

test('render loader when there are no journeys', () => {
  vi.spyOn(useHydratedStore, 'useHydratedStore').mockImplementationOnce(() => undefined);
  render(<HistoryList />, { wrapper: AppWrapper });
  const spinner = screen.getByRole('alert', { name: 'Loading history' });
  expect(spinner).toBeInTheDocument();
  expect(spinner.getAttribute('aria-live')).toBe('assertive');
});

test('render menu when journeys are available', () => {
  render(<HistoryList />, { wrapper: AppWrapper });
  const menu = screen.getByLabelText('History', { selector: 'div[role="menu"]' });
  expect(menu).toBeInTheDocument();
  expect(menu.getAttribute('role')).toBe('menu');
});

test('should render a menu item for each journey', () => {
  const prompt = faker.lorem.sentence();
  const journeys: Journey[] = [
    {
      createdAt: faker.date.past().toISOString(),
      destinations: [{ id: faker.string.uuid(), enabled: true }],
      id: faker.string.uuid(),
      prompt: { label: prompt, value: prompt },
    },
    {
      createdAt: faker.date.past().toISOString(),
      destinations: [{ id: faker.string.uuid(), enabled: true }],
      id: faker.string.uuid(),
      prompt: { label: prompt, value: prompt },
    },
  ];
  vi.spyOn(useHydratedStore, 'useHydratedStore').mockImplementationOnce(() => journeys);
  render(<HistoryList />, { wrapper: AppWrapper });
  expect(screen.getAllByRole('menuitem', { name: 'History item' }).length).toBe(2);
});
