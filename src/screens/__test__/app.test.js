import { render, screen, waitForLoadingToFinish, act } from 'test/test-utils';
import { server, rest } from 'test/server';
import userEvent from '@testing-library/user-event';
import App from 'screens/app';
import { mockAllIsIntersecting } from 'test/intersection-observer-test-utils';

const API_URL = process.env.REACT_APP_API_URL;

const renderAppScreen = async ({ username } = {}) => {
  jest.useFakeTimers();

  const utils = render(<App />);

  mockAllIsIntersecting(true);

  if (!username) {
    username = 'USERNAME';
  }

  userEvent.type(screen.getByRole('searchbox'), username);
  act(() => jest.advanceTimersByTime(510));

  await waitForLoadingToFinish();

  return { ...utils, username };
};

test('renders the app screens', () => {
  render(<App />);

  expect(screen.getByRole('searchbox')).toBeInTheDocument();
  expect(screen.getByText(/find your github profile/i)).toBeInTheDocument();
});

describe('console error', () => {
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
  });

  test('get an alert if the username is not valid', async () => {
    await renderAppScreen({ username: 'x$y%z' });

    expect(screen.getByRole('alert')).toHaveTextContent(/invalid username/i);
  });

  test('get an alert if the username not found', async () => {
    await renderAppScreen({ username: '404' });

    expect(
      screen.getByRole('alert').querySelector('.chakra-alert__title')
        .textContent
    ).toMatchInlineSnapshot(`"Not Found!"`);
  });
});

test('see profile', async () => {
  const { username } = await renderAppScreen();

  expect(screen.getByLabelText('avatar')).toBeInTheDocument();
  expect(screen.getByLabelText('name')).toBeInTheDocument();
  expect(screen.getByLabelText('username')).toBeInTheDocument();
  expect(screen.getByLabelText('username').textContent).toBe(`(@${username})`);
  expect(screen.getByLabelText('bio')).toBeInTheDocument();
});

test('see message if the repositories is empty', async () => {
  server.use(
    rest.get(`${API_URL}/users/:username/repos`, (req, res, ctx) => {
      return res(ctx.json([]));
    })
  );

  await renderAppScreen();

  expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
    `"User doesn't have any repositories yet"`
  );
});

test('see list repositories', async () => {
  await renderAppScreen();

  expect(screen.getAllByLabelText('star count')[0]).toBeInTheDocument();
  expect(screen.getAllByLabelText('issues count')[0]).toBeInTheDocument();
  expect(screen.getAllByLabelText('fork count')[0]).toBeInTheDocument();
  expect(screen.getAllByLabelText('language')[0]).toBeInTheDocument();
  expect(screen.getAllByLabelText('repo name')[0]).toBeInTheDocument();
  expect(screen.getAllByLabelText('repo description')[0]).toBeInTheDocument();
});

test.todo('scroll down to see all other repositories');
