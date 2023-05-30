import '../styles/globals.css';
import 'reactflow/dist/style.css';

import { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <>
      <Head>
        <title>Dev Journey</title>
        <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width' />
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          /** Put your mantine theme override here */
          colorScheme: 'light',
        }}
      >
        <ModalsProvider>
          <Component {...pageProps} />
        </ModalsProvider>
      </MantineProvider>
    </>
  );
}
