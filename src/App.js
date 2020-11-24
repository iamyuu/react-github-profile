import { ChakraProvider, theme } from '@chakra-ui/react';
import RepositoryList from './screen/repository-list';

export default function App() {
  return (
    <ChakraProvider theme={theme}>
      <RepositoryList />
    </ChakraProvider>
  );
}
