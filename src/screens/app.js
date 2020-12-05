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
  IconButton,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { ProfileFallback, ReposFallback } from 'components';

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

  function handleSearch(event) {
    event.preventDefault();

    const searchValue = event.target.elements.search.value;
    setUsername(searchValue);
  }

  return (
    <Container p="4" maxW="md" centerContent>
      <Box w="full" as="form" onSubmit={handleSearch}>
        <InputGroup>
          <Input
            autoFocus
            isRequired
            id="search"
            type="search"
            variant="filled"
            placeholder="Search github username"
          />
          <InputRightElement>
            <IconButton
              size="sm"
              h="1.75rem"
              type="submit"
              icon={<SearchIcon />}
              aria-label="Search github username"
            />
          </InputRightElement>
        </InputGroup>
      </Box>

      {username ? (
        <ErrorBoundary resetKeys={[username]} FallbackComponent={ErrorFallback}>
          <Box my="6">
            <React.Suspense fallback={<ProfileFallback />}>
              <ProfileDataView username={username} />
            </React.Suspense>
          </Box>

          <React.Suspense fallback={<ReposFallback />}>
            <ReposDataView username={username} />
          </React.Suspense>
        </ErrorBoundary>
      ) : (
        <EmptyState />
      )}
    </Container>
  );
}
