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
    <SimpleGrid spacing="4" minChildWidth="360px">
      {repos.map(repo => (
        <Box
          key={repo.id}
          p="4"
          w="100%"
          as="section"
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
                <Badge borderRadius="full" px="2">
                  {repo.language}
                </Badge>
              </WrapItem>
            )}
          </Wrap>

          <Link href={repo.html_url} isExternal>
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
