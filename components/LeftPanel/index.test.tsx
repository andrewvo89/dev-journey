import { render, screen } from '@testing-library/react';

import AppWrapper from 'components/AppWrapper';
import LeftPanel from 'components/LeftPanel';
import { test } from 'vitest';

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
