import { render, screen } from '@testing-library/react';
import AppWrapper from 'app';

test('renders AppWrapper correctly', () => {
  render(<AppWrapper />);

  expect(screen.getByRole('searchbox')).toBeVisible();
});
