import { IconFlag, IconSend } from '@tabler/icons-react';
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
import { useNodeStore } from 'store/node';
import { usePromptStore } from 'store/prompt';
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

  useEffect(() => {
    const actions: SpotlightAction[] = [];

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
  }, [addJourney, bookmarks, jnodes, prompts, setIsLoading, setPrompt, setSelected, setTab, updateNodes]);
}
