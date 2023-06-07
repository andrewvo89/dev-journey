import '../styles/globals.css';
import 'reactflow/dist/style.css';

import { AppProps } from 'next/app';
import AppWrapper from 'components/AppWrapper';
import Head from 'next/head';

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <>
      <Head>
        <title>Dev Journey</title>
        <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width' />
      </Head>
      <AppWrapper>
        <Component {...pageProps} />
      </AppWrapper>
    </>
  );
}
