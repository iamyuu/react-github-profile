import * as React from 'react';
import useSWR from 'swr';
import {
  Flex,
  Heading,
  Text,
  Link,
  Avatar,
  Box,
  Skeleton,
  SkeletonCircle,
} from '@chakra-ui/react';

export function ProfileFallback() {
  return (
    <Box aria-label="Loading profile">
      <SkeletonCircle mx="auto" size="16" />
      <Skeleton mx="auto" height="8" width="10rem" my="2" />
      <Skeleton mx="auto" height="6" width="20rem" />
    </Box>
  );
}

export default function ProfileDataView({ username }) {
  const { data: profile, error } = useSWR(`/users/${username}`);

  if (error) {
    throw error;
  }

  return (
    <Flex as="section" flexDirection="column" justifyContent="center">
      <Avatar
        mx="auto"
        size="lg"
        name={profile.name}
        src={profile.avatar_url}
      />

      <Heading as="h4" size="md" mt="4" textAlign="center">
        <Link href={profile.html_url} isExternal>
          {profile.name} (@{profile.login})
        </Link>
      </Heading>

      <Text textAlign="center">{profile.bio}</Text>
    </Flex>
  );
}
