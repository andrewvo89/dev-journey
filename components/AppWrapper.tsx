import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { ReactFlowProvider } from 'reactflow';

type Props = {
  children: React.ReactNode;
};

const queryClient = new QueryClient();

export default function AppWrapper(props: Props) {
  const { children } = props;
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
        <ModalsProvider>
          <Notifications zIndex={1003} />
          <ReactFlowProvider>{children}</ReactFlowProvider>
        </ModalsProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
}
