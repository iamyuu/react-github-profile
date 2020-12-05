import * as React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import {
  Container,
  Box,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  InputGroup,
  Input,
  InputRightElement,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { ProfileFallback, ReposFallback } from 'components';
import { useDebounce } from 'utils/hooks';

const ProfileDataView = React.lazy(() => import('components/profile'));
const ReposDataView = React.lazy(() => import('components/repo-list'));

function ErrorFallback({ error }) {
  return (
    <Alert status="error" mt="6">
      <AlertIcon />
      <AlertTitle>{error.message}!</AlertTitle>
      <AlertDescription>Try another username</AlertDescription>
    </Alert>
  );
}

function EmptyState() {
  return <Text mt="6">Find your github profile</Text>;
}

export default function App() {
  const [username, setUsername] = React.useState('');
  const debouncedUsername = useDebounce(username);

  function handleSearch(event) {
    setUsername(event.target.value);
  }

  return (
    <Container p="4" maxW="md" centerContent>
      <Box w="full">
        <InputGroup>
          <Input
            autoFocus
            id="search"
            type="search"
            variant="filled"
            placeholder="Search github username"
            onChange={handleSearch}
          />
          <InputRightElement children={<SearchIcon />} />
        </InputGroup>
      </Box>

      {debouncedUsername ? (
        <ErrorBoundary
          resetKeys={[debouncedUsername]}
          FallbackComponent={ErrorFallback}
        >
          <Box my="6">
            <React.Suspense fallback={<ProfileFallback />}>
              <ProfileDataView username={debouncedUsername} />
            </React.Suspense>
          </Box>

          <React.Suspense fallback={<ReposFallback />}>
            <ReposDataView username={debouncedUsername} />
          </React.Suspense>
        </ErrorBoundary>
      ) : (
        <EmptyState />
      )}
    </Container>
  );
}
