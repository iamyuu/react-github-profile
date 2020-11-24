import * as React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Container, Box, Input } from '@chakra-ui/react';
import { useDebounce } from 'shared/hooks';
import { RepositoryListFallback, RepositoryListLoading } from './view';

const RepositoryList = React.lazy(() => import('./view'));

export default function Repository() {
  const [searchUsername, setSearchUsername] = React.useState('');
  const debouncedSearchUsername = useDebounce(searchUsername, 500);

  return (
    <Container maxW="lg" centerContent>
      <Box py="4" w="full">
        <Input
          variant="filled"
          placeholder="Search github username"
          onChange={event => setSearchUsername(event.target.value)}
        />
      </Box>

      <ErrorBoundary
        resetKeys={[debouncedSearchUsername]}
        FallbackComponent={RepositoryListFallback}
      >
        <React.Suspense fallback={<RepositoryListLoading />}>
          <RepositoryList username={debouncedSearchUsername} />
        </React.Suspense>
      </ErrorBoundary>
    </Container>
  );
}
