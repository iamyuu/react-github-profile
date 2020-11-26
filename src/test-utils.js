import { render as rtlRender } from '@testing-library/react';
import { Provider } from './app';

export * from '@testing-library/react';

export const render = (ui, options) =>
  rtlRender(ui, { wrapper: Provider, ...options });
