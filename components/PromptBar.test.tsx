import * as utils from 'utils/prompt';

import { ClientPrompt, PromptResponse } from 'types/journey';
import PromptBar, { transformDesintations } from 'components/PromptBar';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';

import AppWrapper from 'components/AppWrapper';
import { faker } from '@faker-js/faker';
import { useHistoryStore } from 'store/history';
import { usePromptStore } from 'store/prompt';
import userEvent from '@testing-library/user-event';

test('should render', () => {
  render(<PromptBar placeholder={faker.lorem.sentence()} />, { wrapper: AppWrapper });
  expect(screen.getByRole('combobox', { name: 'Prompt bar' })).toBeInTheDocument();
});

test('should contain placeholder', () => {
  const placeholder = faker.lorem.sentence();
  render(<PromptBar placeholder={placeholder} />, { wrapper: AppWrapper });
  expect(screen.getByPlaceholderText(placeholder)).toBeInTheDocument();
});

test('should contain prompt value from selected history journey', () => {
  const prompt = faker.lorem.sentence();
  act(() => {
    useHistoryStore.getState().setSelected({
      createdAt: faker.date.past().toISOString(),
      destinations: [],
      id: faker.string.uuid(),
      prompt: { label: prompt, value: prompt },
    });
  });

  render(<PromptBar placeholder={faker.lorem.sentence()} />, { wrapper: AppWrapper });
  expect(screen.getByRole('combobox', { name: 'Prompt bar' }).getAttribute('value')).toBe(prompt);
});

test('should contain prompt value of user input', async () => {
  render(<PromptBar placeholder={faker.lorem.sentence()} />, { wrapper: AppWrapper });
  const input = screen.getByRole('combobox', { name: 'Prompt bar' });
  const value = faker.lorem.sentence();
  act(() => {
    fireEvent.change(input, { target: { value } });
  });
  expect(input.getAttribute('value')).toBe(value);
});

test('prompt bar text is bound when user chooses an auto select item', async () => {
  const user = userEvent.setup({ delay: null });

  vi.spyOn(utils, 'getPromptDestinations').mockResolvedValueOnce([]);

  const prompts = [faker.lorem.sentence(), faker.lorem.sentence(), faker.lorem.sentence()];
  act(() => {
    const clientPrompts: ClientPrompt[] = prompts.map((prompt) => ({ label: prompt, value: prompt }));
    usePromptStore.getState().setPrompts(clientPrompts);
  });
  render(<PromptBar placeholder={faker.lorem.sentence()} />, { wrapper: AppWrapper });
  const input = screen.getByRole('combobox', { name: 'Prompt bar' });

  act(() => {
    fireEvent.click(input);
  });
  const options = screen.getAllByRole('option');
  expect(options).toHaveLength(3);

  expect(useHistoryStore.getState().selected).toBeFalsy();
  await user.click(options[2]);
  expect(useHistoryStore.getState().selected?.prompt).toStrictEqual({ label: prompts[2], value: prompts[2] });

  expect(input.getAttribute('value')).toBe(prompts[2]);
}, 10000);

test('utils is called when user selects a drop down item', async () => {
  const user = userEvent.setup({ delay: null });

  const spyFn = vi.spyOn(utils, 'getPromptDestinations').mockResolvedValueOnce([]);
  const prompts = [faker.lorem.sentence(), faker.lorem.sentence(), faker.lorem.sentence()];

  const clientPrompts: ClientPrompt[] = prompts.map((prompt) => ({ label: prompt, value: prompt }));
  act(() => {
    usePromptStore.getState().setPrompts(clientPrompts);
  });
  render(<PromptBar placeholder={faker.lorem.sentence()} />, { wrapper: AppWrapper });
  const input = screen.getByRole('combobox', { name: 'Prompt bar' });

  act(() => {
    fireEvent.click(input);
  });
  const options = screen.getAllByRole('option');
  expect(options).toHaveLength(3);
  await user.click(options[2]);

  expect(spyFn).toBeCalledWith(clientPrompts[2]);
});

test('application does not crash when utils call fails', async () => {
  const user = userEvent.setup({ delay: null });
  console.error = vi.fn();
  vi.spyOn(utils, 'getPromptDestinations').mockRejectedValueOnce(new Error('test error'));
  const prompts = [faker.lorem.sentence(), faker.lorem.sentence(), faker.lorem.sentence()];
  act(() => {
    const clientPrompts: ClientPrompt[] = prompts.map((prompt) => ({ label: prompt, value: prompt }));
    usePromptStore.getState().setPrompts(clientPrompts);
  });
  render(<PromptBar placeholder={faker.lorem.sentence()} />, { wrapper: AppWrapper });
  const input = screen.getByRole('combobox', { name: 'Prompt bar' });

  act(() => {
    fireEvent.click(input);
  });
  const options = screen.getAllByRole('option');
  expect(options).toHaveLength(3);
  await user.click(options[2]);

  expect(console.error).toHaveBeenCalledOnce();
});

test('clear button removes text from prompt bar and resets selected to null', async () => {
  const user = userEvent.setup({ delay: null });

  vi.spyOn(utils, 'getPromptDestinations').mockResolvedValueOnce([]);

  const prompts = [faker.lorem.sentence(), faker.lorem.sentence(), faker.lorem.sentence()];
  act(() => {
    const clientPrompts: ClientPrompt[] = prompts.map((prompt) => ({ label: prompt, value: prompt }));
    usePromptStore.getState().setPrompts(clientPrompts);
  });
  render(<PromptBar placeholder={faker.lorem.sentence()} />, { wrapper: AppWrapper });
  const input = screen.getByRole('combobox', { name: 'Prompt bar' });

  act(() => {
    fireEvent.click(input);
  });
  const options = screen.getAllByRole('option');
  expect(options).toHaveLength(3);
  await user.click(options[2]);

  const button = screen.getByLabelText('Clear', { selector: 'button[role="button"]' });
  expect(input.getAttribute('value')).toBe(prompts[2]);

  await user.click(button);
  expect(input.getAttribute('value')).toBe('');
  expect(useHistoryStore.getState().selected).toBeFalsy();
});

test('loading spinner shows during utils call', async () => {
  const user = userEvent.setup({ delay: null });

  vi.spyOn(utils, 'getPromptDestinations').mockResolvedValueOnce([]);

  const prompts = [faker.lorem.sentence(), faker.lorem.sentence(), faker.lorem.sentence()];
  act(() => {
    const clientPrompts: ClientPrompt[] = prompts.map((prompt) => ({ label: prompt, value: prompt }));
    usePromptStore.getState().setPrompts(clientPrompts);
  });
  render(<PromptBar placeholder={faker.lorem.sentence()} />, { wrapper: AppWrapper });
  const input = screen.getByRole('combobox', { name: 'Prompt bar' });

  act(() => {
    fireEvent.click(input);
  });

  user.click(screen.getAllByRole('option')[2]);
  await screen.findByLabelText('Loading result', {
    selector: 'svg[role="alert"][aria-live="assertive"]',
  });
});

test('Destinations are transformed with enabled status', () => {
  const id = faker.string.uuid();
  const destinations: PromptResponse['destinations'] = [{ id }];
  expect(transformDesintations(destinations)).toEqual([{ id, enabled: true }]);
});
