import { renderHook, act } from '@testing-library/react-hooks';
import { useDebounce } from '../hooks';

test('update value after specified delay', () => {
  jest.useFakeTimers();

  const { result, rerender } = renderHook(
    ({ value, delay }) => useDebounce(value, delay),
    { initialProps: { value: '', delay: 500 } }
  );

  expect(result.current).toBe('');
  act(() => jest.advanceTimersByTime(510));
  expect(result.current).toBe('');

  rerender({ value: 'Hello World', delay: 500 });

  expect(result.current).toBe('');
  act(() => jest.advanceTimersByTime(498));
  expect(result.current).toBe('');

  act(() => jest.advanceTimersByTime(3));
  expect(result.current).toBe('Hello World');
});

// TODO: test intersection observer
// @see https://github.com/thebuilder/react-intersection-observer/blob/master/src/test-utils.ts
// @see https://github.com/thebuilder/react-intersection-observer/blob/master/src/__tests__/hooks.test.tsx
test.todo('useIntersection');
