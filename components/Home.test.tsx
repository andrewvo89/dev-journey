import { expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import AppWrapper from 'components/AppWrapper';
import { Destination } from 'types/common';
import Home from 'components/Home';
import { act } from 'react-dom/test-utils';
import { faker } from '@faker-js/faker';
import { useHistoryStore } from 'store/history';
import { useNodeStore } from 'store/node';

test('renders main container', () => {
  render(<Home prompts={[]} initialEdges={[]} initialJNodes={[]} initialNodes={[]} placeholder='' />, {
    wrapper: AppWrapper,
  });
  expect(screen.getByRole('main', { name: 'Main container' })).toBeInTheDocument();
});

test('renders right container', () => {
  render(<Home prompts={[]} initialEdges={[]} initialJNodes={[]} initialNodes={[]} placeholder='' />, {
    wrapper: AppWrapper,
  });
  expect(screen.getByRole('region', { name: 'Right container' })).toBeInTheDocument();
});

test('updates nodes with no destinations', () => {
  const mockUpdateNodes = vi.fn();
  useNodeStore.getState().updateNodes = mockUpdateNodes;

  render(<Home prompts={[]} initialEdges={[]} initialJNodes={[]} initialNodes={[]} placeholder='' />, {
    wrapper: AppWrapper,
  });
  expect(mockUpdateNodes).toHaveBeenCalledWith([]);
});

test('updates nodes with selected destinations', async () => {
  const prompt = faker.lorem.sentence();
  const destinations: Destination[] = [{ id: faker.string.uuid(), enabled: true }];

  const mockUpdateNodes = vi.fn();
  useNodeStore.getState().updateNodes = mockUpdateNodes;

  act(() => {
    useHistoryStore.getState().setSelected({
      createdAt: faker.date.past().toISOString(),
      destinations,
      id: faker.string.uuid(),
      prompt: { label: prompt, value: prompt },
    });
  });
  render(<Home prompts={[]} initialEdges={[]} initialJNodes={[]} initialNodes={[]} placeholder='' />, {
    wrapper: AppWrapper,
  });
  expect(mockUpdateNodes).toHaveBeenCalledWith(destinations);
});
