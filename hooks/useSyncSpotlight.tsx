import {
  IconBookmark,
  IconFlag,
  IconHistory,
  IconInfoCircle,
  IconPlus,
  IconSend,
  IconSettings,
  IconZoomReset,
} from '@tabler/icons-react';
import { SpotlightAction, spotlight } from '@mantine/spotlight';
import { actionHandler, getIcon, getLabel, getPrettyType } from 'utils/bookmark';

import dayjs from 'dayjs';
import { getPromptDestinations } from 'utils/prompt';
import { shallow } from 'zustand/shallow';
import { transformDesintations } from 'components/PromptBar';
import { useBookmarkStore } from 'store/bookmark';
import { useEffect } from 'react';
import { useHistoryStore } from 'store/history';
import { useHydratedStore } from 'hooks/useHydratedStore';
import { useInputRefStore } from 'store/input-ref';
import { useNodeStore } from 'store/node';
import { usePromptStore } from 'store/prompt';
import { useSettingsMenuStore } from 'store/settings-menu';
import { useTabStore } from 'store/tab';
import { v4 as uuidv4 } from 'uuid';

export function useSyncSpotlight() {
  const jnodes = useNodeStore((state) => state.jnodes);

  const { setPrompt, prompts, setIsLoading } = usePromptStore(
    (state) => ({
      prompt: state.prompt,
      setPrompt: state.setPrompt,
      prompts: state.prompts,
      setIsLoading: state.setIsLoading,
    }),
    shallow,
  );
  const { addJourney, setSelected } = useHistoryStore(
    (state) => ({ addJourney: state.addJourney, selected: state.selected, setSelected: state.setSelected }),
    shallow,
  );
  const bookmarks = useHydratedStore(useBookmarkStore, (state) => state.bookmarks);
  const updateNodes = useNodeStore((state) => state.updateNodes);
  const setTab = useTabStore((state) => state.setTab);

  const setIsOpen = useSettingsMenuStore((state) => state.setIsOpen);
  const inputRef = useInputRefStore((state) => state.inputRef);

  useEffect(() => {
    const actions: SpotlightAction[] = [
      {
        id: 'action-settings',
        title: 'Open settings',
        description: 'Action',
        icon: <IconSettings />,
        closeOnTrigger: true,
        onTrigger: () => setIsOpen(true),
      },
      {
        id: 'action-settings',
        title: 'Start a new journey',
        description: 'Action',
        icon: <IconPlus />,
        closeOnTrigger: true,
        onTrigger: () => inputRef?.focus(),
      },
      {
        id: 'action-reset-view',
        title: 'Reset view to default',
        description: 'Action',
        icon: <IconZoomReset />,
        closeOnTrigger: true,
        onTrigger: () => {
          setSelected(null);
          updateNodes([]);
        },
      },
      {
        id: 'action-goto-history',
        title: 'Go to history tab',
        description: 'Action',
        icon: <IconHistory />,
        closeOnTrigger: true,
        onTrigger: () => setTab('history'),
      },
      {
        id: 'action-goto-bookmarks',
        title: 'Go to bookmarks tab',
        description: 'Action',
        icon: <IconBookmark />,
        closeOnTrigger: true,
        onTrigger: () => setTab('bookmarks'),
      },
      {
        id: 'action-goto-info',
        title: 'Go to info tab',
        description: 'Action',
        icon: <IconInfoCircle />,
        closeOnTrigger: true,
        onTrigger: () => setTab('info'),
      },
    ];
    if (bookmarks) {
      actions.push(
        ...bookmarks
          .filter((bookmark) => bookmark.type !== 'journey' && bookmark.type !== 'destination')
          .map<SpotlightAction>((bookmark) => {
            const Icon = getIcon(bookmark.type);
            return {
              id: `bookmark-${bookmark.id}`,
              title: getLabel(bookmark),
              description: getPrettyType(bookmark.type),
              icon: <Icon />,
              onTrigger: () => actionHandler({ bookmark, setSelected, updateNodes, window }),
              closeOnTrigger: false,
            };
          }),
      );
    }

    if (prompts) {
      actions.push(
        ...prompts.map<SpotlightAction>((prompt) => ({
          id: `prompt-${prompt.label}`,
          title: prompt.label,
          description: 'Prompt',
          icon: <IconSend />,
          onTrigger: async () => {
            setIsLoading(true);
            setPrompt(prompt.label);
            try {
              const destinations = await getPromptDestinations(prompt);
              addJourney({
                id: uuidv4(),
                createdAt: dayjs().toISOString(),
                destinations: transformDesintations(destinations),
                prompt,
              });
              setTab('history');
            } catch (error) {
              console.error(error);
            } finally {
              setIsLoading(false);
            }
          },
        })),
      );
    }

    actions.push(
      ...Array.from(jnodes.values()).map<SpotlightAction>((jnode) => ({
        id: `destination-${jnode.id}`,
        title: jnode.title,
        description: 'Destination',
        icon: <IconFlag />,
        onTrigger: () => {
          updateNodes([{ id: jnode.id, enabled: true }]);
          setSelected(null);
        },
      })),
    );

    spotlight.registerActions(actions);
  }, [addJourney, bookmarks, jnodes, prompts, setIsLoading, setIsOpen, setPrompt, setSelected, setTab, updateNodes]);
}
