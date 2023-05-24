import { Autocomplete, Loader, createStyles } from '@mantine/core';
import { useEffect, useState } from 'react';

import { ClientPrompt } from 'types/common';
import dayjs from 'dayjs';
import { promptResponseSchema } from 'schemas/common';
import { shallow } from 'zustand/shallow';
import { useHistoryStore } from 'store/history';
import { usePromptStore } from 'store/prompt';
import { v4 as uuidv4 } from 'uuid';

const useStyles = createStyles((theme, props: { isLoading: boolean }) => ({
  autocomplete: {
    position: 'sticky',
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

export default function PromptBar() {
  const [isLoading, setIsLoading] = useState(false);
  const { classes } = useStyles({ isLoading });

  const { prompt, setPrompt, prompts } = usePromptStore(
    (state) => ({ prompt: state.prompt, setPrompt: state.setPrompt, prompts: state.prompts }),
    shallow,
  );

  const { addJourney, selected } = useHistoryStore(
    (state) => ({ addJourney: state.addJourney, selected: state.selected }),
    shallow,
  );

  const itemSelectedHandler = async (prompt: ClientPrompt) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/prompts/${prompt.value}`, { method: 'POST' });
      const jsonResponse = await res.json();
      const { goalIds } = promptResponseSchema.parse(jsonResponse);
      addJourney({ id: uuidv4(), createdAt: dayjs().toISOString(), goalIds, prompt });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setPrompt(selected?.prompt.label ?? '');
  }, [selected, setPrompt]);

  return (
    <Autocomplete
      classNames={{ root: classes.autocomplete, input: classes.input }}
      placeholder='Prompt dev journey...'
      data={prompts}
      value={prompt}
      onChange={setPrompt}
      onItemSubmit={itemSelectedHandler}
      filter={(value, prompt: ClientPrompt) => prompt.label.toLowerCase().includes(value.toLowerCase())}
      dropdownPosition='flip'
      switchDirectionOnFlip
      readOnly={isLoading}
      rightSection={isLoading ? <Loader size='sm' /> : undefined}
      size='lg'
    />
  );
}
