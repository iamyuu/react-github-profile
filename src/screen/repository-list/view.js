import * as React from 'react';
import {
  Box,
  Text,
  Avatar,
  Link,
  Button,
  Badge,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
} from '@chakra-ui/react';
import { useRemoteData } from 'shared/hooks';

export function RepositoryListLoading() {
  return (
    <Box>
      <Spinner size="xl" />
    </Box>
  );
}

export function RepositoryListFallback({ error, resetErrorBoundary }) {
  const isNotFound = /not found/i.test(error.message);

  return (
    <Alert
      status={isNotFound ? 'warning' : 'error'}
      variant="subtle"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      height="200px"
    >
      <AlertIcon boxSize="40px" mr={0} />
      <AlertTitle m="4" fontSize="lg">
        {error.message}
      </AlertTitle>
      <AlertDescription maxWidth="sm">
        {!isNotFound && (
          <Button colorScheme="red" onClick={resetErrorBoundary}>
            Try again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}

export default function RepositoryList({ username = '' }) {
  const { data, error } = useRemoteData(
    username ? `/users/${username}/repos` : null
  );

  if (error) {
    throw error;
  }

  if (!username) {
    return null;
  }

  return data.map(repositoryItem => {
    return (
      <Box
        key={repositoryItem.id}
        p="6"
        m="2"
        w="100%"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
      >
        <Box d="flex" alignItems="baseline">
          {repositoryItem.language && (
            <Badge borderRadius="full" px="2" colorScheme="teal">
              {repositoryItem.language}
            </Badge>
          )}

          <Box
            color="gray.500"
            fontWeight="semibold"
            letterSpacing="wide"
            fontSize="xs"
            textTransform="uppercase"
            ml={repositoryItem.language ? '2' : '0'}
          >
            {repositoryItem.open_issues_count} Opened issues &bull;{' '}
            {repositoryItem.forks_count} forks
          </Box>
        </Box>

        <Link href={repositoryItem.owner.url} breakout isExternal>
          <Box d="flex" alignItems="center" my="4">
            <Avatar
              size="sm"
              name={repositoryItem.owner.login}
              src={repositoryItem.owner.avatar_url}
            />

            <Text ml="2">{repositoryItem.owner.login}</Text>
          </Box>
        </Link>

        <Link href={repositoryItem.html_url} breakout isExternal>
          <Box
            mt="1"
            fontWeight="semibold"
            as="h4"
            lineHeight="tight"
            fontSize="xl"
            isTruncated
          >
            {repositoryItem.name}
          </Box>
        </Link>

        <Text>{repositoryItem.description}</Text>
      </Box>
    );
  });
}
