import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SpotlightAction, SpotlightProvider } from '@mantine/spotlight';

import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { ReactFlowProvider } from 'reactflow';
import { useState } from 'react';

type Props = {
  children: React.ReactNode;
};

const queryClient = new QueryClient();

export default function AppWrapper(props: Props) {
  const { children } = props;
  const [actions, setActions] = useState<SpotlightAction[]>([]);

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          /** Put your mantine theme override here */
          colorScheme: 'light',
        }}
      >
        <SpotlightProvider actions={actions} onActionsChange={setActions}>
          <ModalsProvider>
            <Notifications zIndex={1003} />
            <ReactFlowProvider>{children}</ReactFlowProvider>
          </ModalsProvider>
        </SpotlightProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
}
