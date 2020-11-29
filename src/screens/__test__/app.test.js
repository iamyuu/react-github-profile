import { render, screen, waitForLoadingToFinish } from 'test/test-utils';
import { server, rest } from 'test/server';
import userEvent from '@testing-library/user-event';
import App from 'screens/app';

const API_URL = process.env.REACT_APP_API_URL;

const renderAppScreen = async ({ username } = {}) => {
  const utils = render(<App />);

  if (!username) {
    username = 'USERNAME';
  }

  userEvent.type(screen.getByRole('searchbox'), username);
  userEvent.click(
    screen.getByRole('button', { name: /search github username/i })
  );

  await waitForLoadingToFinish();

  return { ...utils, username };
};

test('renders the app screens', () => {
  render(<App />);

  expect(screen.getByText(/find your github profile/i)).toBeInTheDocument();
  expect(screen.getByRole('searchbox')).toBeInTheDocument();
  expect(
    screen.getByRole('button', { name: /search github username/i })
  ).toBeInTheDocument();
});

test('get an alert if the username is not valid', () => {
  render(<App />);

  userEvent.type(screen.getByRole('searchbox'), 'x$y%z');
  userEvent.click(
    screen.getByRole('button', { name: /search github username/i })
  );

  expect(screen.getByRole('alert')).toHaveTextContent(/invalid username/i);
});

describe('console error', () => {
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
  });

  test('get an alert if the username not found', async () => {
    render(<App />);

    userEvent.type(screen.getByRole('searchbox'), '404');
    userEvent.click(
      screen.getByRole('button', { name: /search github username/i })
    );

    await waitForLoadingToFinish();

    expect(
      screen.getByRole('alert').querySelector('.chakra-alert__title')
        .textContent
    ).toMatchInlineSnapshot(`"Not Found!"`);
  });
});

test('see avatar, name, username', async () => {
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
