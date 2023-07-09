import { spotlight } from '@mantine/spotlight';
import { useHotkeys } from '@mantine/hooks';
import { useSettingsMenuStore } from 'store/settings-menu';

export function useHotKeys() {
  const toggleIsOpen = useSettingsMenuStore((state) => state.toggleIsOpen);

  useHotkeys([
    ['mod+m', toggleIsOpen],
    [
      'mod+f',
      () => {
        console.log('trigger');
        spotlight.toggle();
      },
    ],
  ]);
}
