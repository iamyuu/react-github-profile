import * as React from 'react';
import { SWRConfig } from 'swr';
import { ChakraProvider } from '@chakra-ui/react';
import theme from 'theme';
import client from 'utils/api-client';
import AppScreen from 'screens/app';

const swrConfig = {
  fetcher: (...args) => client(...args),
  suspense: true,
};

export function Provider({ children }) {
  return (
    <SWRConfig value={swrConfig}>
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </SWRConfig>
  );
}

export default function AppWrapper() {
  return (
    <Provider>
      <AppScreen />
    </Provider>
  );
}
