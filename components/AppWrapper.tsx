import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { ReactFlowProvider } from 'reactflow';

type Props = {
  children: React.ReactNode;
};

export default function AppWrapper(props: Props) {
  const { children } = props;
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        /** Put your mantine theme override here */
        colorScheme: 'light',
      }}
    >
      <ModalsProvider>
        <ReactFlowProvider>{children}</ReactFlowProvider>
      </ModalsProvider>
    </MantineProvider>
  );
}
