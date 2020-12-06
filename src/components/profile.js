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
import { username as validateUsername } from 'utils/validation';

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
  const { isValid, error } = validateUsername(username);
  const { data: profile, error: apiError } = useSWR(
    isValid ? `/users/${username}` : null
  );

  // TODO: Test this use case
  if (error || apiError) {
    throw error || apiError;
  }

  return (
    <Flex as="section" flexDirection="column" justifyContent="center">
      <Avatar
        mx="auto"
        size="lg"
        aria-label="avatar"
        name={profile.name}
        src={profile.avatar_url}
      />

      <Heading as="h4" size="md" mt="4" textAlign="center">
        <Link href={profile.html_url} isExternal aria-label={profile.name}>
          <Text as="span" aria-label="name">
            {profile.name}
          </Text>
          <Text as="span" aria-label="username">
            (@{profile.login})
          </Text>
        </Link>
      </Heading>

      <Text textAlign="center" aria-label="bio">
        {profile.bio}
      </Text>
    </Flex>
  );
}
