import * as React from 'react';
import useSWR from 'swr';
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

export function ReposFallback() {
  return (
    <Box mt="4" aria-label="Loading list repository">
      <Spinner size="xl" />
    </Box>
  );
}

function ReposEmptyState() {
  return <Text>User doesn't have any repositories yet</Text>;
}

// TODO: implementing infinite scroll
export default function ReposDataView({ username }) {
  const { data: repos, error } = useSWR(`/users/${username}/repos`);

  if (error) {
    throw error;
  }

  if (repos.length < 1) {
    return <ReposEmptyState />;
  }

  return (
    <SimpleGrid columns="2" spacingX="4" spacingY="2">
      {repos.map(repo => (
        <Box
          key={repo.id}
          p="4"
          m="2"
          w="100%"
          as="section"
          borderWidth="1px"
          borderRadius="lg"
          boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
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
                <Badge borderRadius="full" px="2">
                  {repo.language}
                </Badge>
              </WrapItem>
            )}
          </Wrap>

          <Link href={repo.html_url} breakout isExternal>
            <Heading mt="1" as="h4" size="md" lineHeight="tight">
              {repo.name}
            </Heading>
          </Link>

          <Text>{repo.description}</Text>
        </Box>
      ))}
    </SimpleGrid>
  );
}
