import { createStyles } from '@mantine/core';

export const useModalStyles = createStyles((theme) => ({
  overlay: {
    zIndex: 1001,
  },
  inner: {
    zIndex: 1002,
  },
  h1: {
    fontSize: theme.headings.sizes.h1.fontSize,
    fontWeight: 700,
    lineHeight: theme.headings.sizes.h1.lineHeight,
  },
  h2: {
    fontSize: theme.headings.sizes.h2.fontSize,
    fontWeight: 700,
    lineHeight: theme.headings.sizes.h2.lineHeight,
  },
  h3: {
    fontSize: theme.headings.sizes.h3.fontSize,
    fontWeight: 700,
    lineHeight: theme.headings.sizes.h3.lineHeight,
  },
}));
