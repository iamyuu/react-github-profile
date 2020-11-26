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
  Tooltip,
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

const validateGithubUsername = username =>
  /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(username);

export default function App() {
  const [username, setUsername] = React.useState('');
  const [error, setError] = React.useState(undefined);

  function handleSearch(event) {
    event.preventDefault();

    setError(undefined);

    const searchValue = event.target.elements.search.value;

    if (!searchValue) {
      setUsername('');
    } else if (!validateGithubUsername(searchValue)) {
      setError(new Error('Invalid username'));
    } else {
      setUsername(searchValue);
    }
  }

  return (
    <Container p="4" maxW="md" centerContent>
      <Box w="full" as="form" onSubmit={handleSearch}>
        <InputGroup>
          <Input
            autoFocus
            id="search"
            type="search"
            variant="filled"
            placeholder="Search github username"
          />
          <InputRightElement>
            <Tooltip hasArrow label="Search github username">
              <IconButton
                size="sm"
                h="1.75rem"
                type="submit"
                icon={<SearchIcon />}
                aria-label="Search github username"
              />
            </Tooltip>
          </InputRightElement>
        </InputGroup>
      </Box>

      {!username && !error ? <EmptyState /> : null}
      {username && error ? <ErrorFallback error={error} /> : null}

      {username && !error ? (
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
      ) : null}
    </Container>
  );
}
