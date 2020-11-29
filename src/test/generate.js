import faker from 'faker';

export const buildProfile = overrides => ({
  name: faker.name.firstName(),
  login: faker.internet.userName(),
  avatar_url: faker.image.people(),
  html_url: faker.internet.url(),
  bio: faker.random.words(),
  ...overrides,
});

export const buildRepo = overrides => ({
  id: faker.random.uuid(),
  name: faker.name.title(),
  description: faker.random.words(),
  stargazers_count: faker.random.number(),
  open_issues_count: faker.random.number(),
  forks_count: faker.random.number(),
  language: faker.random.alpha(),
  html_url: faker.internet.url(),
  ...overrides,
});
