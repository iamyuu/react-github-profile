import * as React from 'react';
import {
  Box,
  Wrap,
  WrapItem,
  Spacer,
  Heading,
  Text,
  Link,
  Badge,
  Spinner,
  SimpleGrid,
} from '@chakra-ui/react';
import { username as validateUsername } from 'utils/validation';
import { useInfiniteScroll } from 'utils/hooks';

export function ReposFallback() {
  return (
    <Box mt="4" aria-label="Loading list repository">
      <Spinner size="xl" />
    </Box>
  );
}

function ReposEmptyState() {
  return <Text role="alert">User doesn't have any repositories yet</Text>;
}

export default function ReposDataView({ username }) {
  const { isValid, error } = validateUsername(username);
  const {
    ref,
    items: repos,
    error: apiError,
    isEmpty,
    isLoadingMore,
    isReachingEnd,
  } = useInfiniteScroll(isValid ? `/users/${username}/repos` : null);

  if (error || apiError) {
    throw error || apiError;
  }

  if (isEmpty) {
    return <ReposEmptyState />;
  }

  return (
    <>
      <SimpleGrid spacing="4" minChildWidth="360px">
        {repos.map(repo => (
          <Box
            key={repo.id}
            p="4"
            w="100%"
            as="section"
            bg="gray.700"
            boxShadow="md"
            borderRadius="lg"
          >
            <Wrap>
              <WrapItem
                color="gray.500"
                fontWeight="semibold"
                letterSpacing="wide"
                fontSize="xs"
                textTransform="uppercase"
              >
                <Text as="span" aria-label="star count" mr="1">
                  {repo.stargazers_count} Star
                </Text>
                •
                <Text as="span" aria-label="issues count" mx="1">
                  {repo.open_issues_count} issues
                </Text>
                •
                <Text as="span" aria-label="fork count" ml="1">
                  {repo.forks_count} fork
                </Text>
              </WrapItem>

              <Spacer />

              {repo.language && (
                <WrapItem>
                  <Badge borderRadius="full" px="2" aria-label="language">
                    {repo.language}
                  </Badge>
                </WrapItem>
              )}
            </Wrap>

            <Heading
              mt="1"
              as="h4"
              size="md"
              lineHeight="tight"
              aria-label="repo name"
            >
              <Link href={repo.html_url} isExternal>
                {repo.name}
              </Link>
            </Heading>

            <Text aria-label="repo description">{repo.description}</Text>
          </Box>
        ))}
      </SimpleGrid>

      <div ref={ref}>
        {!isReachingEnd && isLoadingMore ? <ReposFallback /> : null}
      </div>
    </>
  );
}
