import { render, screen } from '@testing-library/react';

import AppWrapper from 'components/AppWrapper';
import Home from 'components/Home';
import { expect } from 'vitest';

test('renders main container', () => {
  render(
    <AppWrapper>
      <Home prompts={[]} initialEdges={[]} initialJNodes={[]} initialNodes={[]} placeholder='' />
    </AppWrapper>,
  );
  expect(screen.getByRole('main', { name: 'Main container' })).toBeDefined();
});

test('renders right container', () => {
  render(
    <AppWrapper>
      <Home prompts={[]} initialEdges={[]} initialJNodes={[]} initialNodes={[]} placeholder='' />
    </AppWrapper>,
  );
  expect(screen.getByRole('region', { name: 'Right container' })).toBeDefined();
});
