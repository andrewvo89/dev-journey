import { Autocomplete, CloseButton, Loader, createStyles } from '@mantine/core';
import { ClientPrompt, DestinationPath, OptionalPath } from 'types/common';
import { getPathsToJnode, resolveNodeIdsToJNodes } from 'utils/jnodes';
import { useEffect, useRef, useState } from 'react';

import dayjs from 'dayjs';
import { promptResponseSchema } from 'schemas/common';
import { shallow } from 'zustand/shallow';
import { useHistoryStore } from 'store/history';
import { useInputRefStore } from 'store/input-ref';
import { useNodeStore } from 'store/nodes';
import { usePromptStore } from 'store/prompt';
import { v4 as uuidv4 } from 'uuid';

const useStyles = createStyles((theme, props: { isLoading: boolean }) => ({
  autocomplete: {
    position: 'absolute',
    bottom: 32,
    width: '50%',
    boxShadow: theme.shadows.md,
    left: 0,
    right: 0,
    margin: 'auto',
  },
  input: {
    backgroundColor: props.isLoading ? '#f1f3f5' : undefined,
    color: props.isLoading ? '#909296' : undefined,
    opacity: props.isLoading ? 0.6 : undefined,
    cursor: props.isLoading ? 'not-allowed' : undefined,
    pointer: props.isLoading ? 'events:none' : undefined,
  },
}));

type Props = {
  placeholder: string;
};

export default function PromptBar(props: Props) {
  const { placeholder } = props;
  const [isLoading, setIsLoading] = useState(false);
  const { classes } = useStyles({ isLoading });
  const ref = useRef<HTMLInputElement>(null);

  const setInputRef = useInputRefStore((state) => state.setInputRef);

  useEffect(() => {
    // Happens after first render when UI assigns the ref
    setInputRef(ref.current);
  }, [setInputRef]);

  const { prompt, setPrompt, prompts } = usePromptStore(
    (state) => ({ prompt: state.prompt, setPrompt: state.setPrompt, prompts: state.prompts }),
    shallow,
  );

  const { addJourney, selected } = useHistoryStore(
    (state) => ({ addJourney: state.addJourney, selected: state.selected }),
    shallow,
  );

  const jnodes = useNodeStore((state) => state.jnodes);

  const itemSelectedHandler = async (prompt: ClientPrompt) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/prompts/${prompt.value}`, { method: 'POST' });
      const jsonResponse = await res.json();
      const { destinations } = promptResponseSchema.parse(jsonResponse);

      const desJnodes = resolveNodeIdsToJNodes(
        destinations.map((des) => des.id),
        jnodes,
      );

      const desPaths = desJnodes.map<DestinationPath>((jnode) => ({
        desId: jnode.id,
        enabled: true,
        routes: getPathsToJnode('root', jnode, jnodes),
      }));

      const optPaths = desJnodes.reduce<OptionalPath[]>((list, jnode) => {
        const newList = jnode.pathways.reduce<OptionalPath[]>((list, pathway) => {
          const pathwayJnode = jnodes.get(pathway);
          if (!pathwayJnode) {
            return list;
          }
          const path: OptionalPath = {
            desId: pathway,
            routes: getPathsToJnode(jnode.id, pathwayJnode, jnodes),
          };
          return [...list, path];
        }, []);
        return [...list, ...newList];
      }, []);

      addJourney({ id: uuidv4(), createdAt: dayjs().toISOString(), desPaths, optPaths, prompt });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setPrompt(selected?.prompt.label ?? '');
  }, [selected, setPrompt]);

  const clearClickHandler = () => {
    setPrompt('');
    if (ref.current) {
      ref.current.focus();
    }
  };

  return (
    <Autocomplete
      ref={ref}
      classNames={{ root: classes.autocomplete, input: classes.input }}
      hoverOnSearchChange
      placeholder={placeholder}
      data={prompts}
      value={prompt}
      onChange={setPrompt}
      onItemSubmit={itemSelectedHandler}
      filter={(value, prompt: ClientPrompt) => prompt.label.toLowerCase().includes(value.toLowerCase())}
      dropdownPosition='flip'
      switchDirectionOnFlip
      readOnly={isLoading}
      rightSection={
        isLoading ? <Loader size='sm' /> : <CloseButton variant='transparent' size='lg' onClick={clearClickHandler} />
      }
      size='lg'
    />
  );
}
