import { rest } from 'msw';
import { buildProfile, buildRepo } from 'test/generate';

const API_URL = process.env.REACT_APP_API_URL;

export const handlers = [
  rest.get(`${API_URL}/users/:username`, (req, res, ctx) => {
    const { username } = req.params;
    if (username === '404') {
      return res(ctx.status(404), ctx.json({ message: 'Not Found' }));
    }

    const profile = buildProfile({ login: username });

    return res(ctx.json(profile));
  }),
  rest.get(`${API_URL}/users/:username/repos`, (req, res, ctx) => {
    const { username } = req.params;

    if (username === '404') {
      return res(ctx.status(404), ctx.json({ message: 'Not Found' }));
    }

    return res(
      ctx.json([
        buildRepo(),
        buildRepo({ language: null }),
        buildRepo({ description: null }),
      ])
    );
  }),
];
