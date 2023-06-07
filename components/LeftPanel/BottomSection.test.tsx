import { render, screen } from '@testing-library/react';

import AppWrapper from 'components/AppWrapper';
import BottomSection from 'components/LeftPanel/BottomSection';
import packageJSON from 'package.json';
import { test } from 'vitest';

test('should render version', () => {
  render(<BottomSection />, { wrapper: AppWrapper });
  expect(screen.getByRole('term', { name: 'Version' }).textContent).toBe(`Version ${packageJSON.version}`);
});
