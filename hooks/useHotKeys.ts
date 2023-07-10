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
    ['mod+shift+m', toggleIsOpen],
    ['mod+shift+f', () => spotlight.toggle()],
    ['mod+shift+n', () => inputRef?.focus()],
    ['/', () => inputRef?.focus()],
    ['mod+shift+h', () => setTab('history')],
    ['mod+shift+b', () => setTab('bookmarks')],
    ['mod+shift+i', () => setTab('info')],
    [
      'mod+shift+r',
      () => {
        setSelected(null);
        updateNodes([]);
      },
    ],
  ]);
}
