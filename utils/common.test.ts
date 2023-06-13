import { expect, test } from 'vitest';

import { toReadableHours } from 'utils/common';

test('0 minutes to show 0m', () => {
  expect(toReadableHours(0)).toBe('0m');
});

test('0 minutes to show 69 minutes to show 1hr 9m', () => {
  expect(toReadableHours(69)).toBe('1h 9m');
});

test('0 minutes to show 60 minutes to show 1hr', () => {
  expect(toReadableHours(60)).toBe('1h');
});
