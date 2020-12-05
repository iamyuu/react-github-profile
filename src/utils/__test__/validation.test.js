import { username as validateUsername } from '../validation';

test('validate username with the valid username', () => {
  const username = 'USERNAME';
  const result = validateUsername(username);

  expect(result).toHaveProperty('isValid', true);
  expect(result).toHaveProperty('error', undefined);
});

describe('console error', () => {
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
  });

  test('validate username with invalid username', () => {
    const username = 'INVALID_USERNAME';
    const result = validateUsername(username);

    expect(result).toHaveProperty('isValid', false);
    expect(result).toHaveProperty('error.message');
  });

  test('validate username without any arguments', () => {
    const result = validateUsername();

    expect(result).toHaveProperty('isValid', false);
    expect(result).toHaveProperty('error.message');
  });
});
