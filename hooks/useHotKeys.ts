import { spotlight } from '@mantine/spotlight';
import { useHistoryStore } from 'store/history';
import { useHotkeys } from '@mantine/hooks';
import { useInputRefStore } from 'store/input-ref';
import { useNodeStore } from 'store/node';
import { useSettingsMenuStore } from 'store/settings-menu';
import { useTabStore } from 'store/tab';

export function useHotKeys() {
  const toggleIsOpen = useSettingsMenuStore((state) => state.toggleIsOpen);
  const inputRef = useInputRefStore((state) => state.inputRef);
  const setSelected = useHistoryStore((state) => state.setSelected);
  const updateNodes = useNodeStore((state) => state.updateNodes);
  const setTab = useTabStore((state) => state.setTab);

  useHotkeys([
    ['mod+m', toggleIsOpen],
    ['mod+f', () => spotlight.toggle()],
    ['mod+n', () => inputRef?.focus()],
    ['/', () => inputRef?.focus()],
    ['mod+h', () => setTab('history')],
    ['mod+b', () => setTab('bookmarks')],
    ['mod+i', () => setTab('info')],
    [
      'mod+r',
      () => {
        setSelected(null);
        updateNodes([]);
      },
    ],
  ]);
}
