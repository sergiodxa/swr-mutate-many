import * as React from 'react';
import { render, act } from '@testing-library/react';
import { mutateMany } from '../src';
import useSWR, { SWRConfig, cache } from 'swr';

function renderTester() {
  let counter1 = 1;
  let counter2 = 2;
  let counter3 = 3;

  function Tester() {
    const key1 = useSWR('key-1', () => counter1++);
    const key2 = useSWR('key-2', () => counter2++);
    const randomKey = useSWR('random-key', () => counter3++);

    if (!key1.data || !key2.data || !randomKey.data) return null;

    return (
      <>
        {key1.data} {key2.data} {randomKey.data}
      </>
    );
  }

  return render(
    <SWRConfig value={{ dedupingInterval: 0 }}>
      <Tester />
    </SWRConfig>
  );
}

describe(mutateMany, () => {
  afterEach(() => {
    cache.clear();
  });

  test('allow trigger a revalidation of matching keys', async () => {
    const { findByText } = renderTester();

    expect(await findByText('1 2 3')).toBeInTheDocument();

    await act(async () => {
      await mutateMany(key => key.startsWith('key-'));
    });

    expect(await findByText('2 3 3')).toBeInTheDocument();
  });

  test('should allow replacing matching keys with no revalidation', async () => {
    const { findByText } = renderTester();
    expect(await findByText('1 2 3')).toBeInTheDocument();

    await act(async () => {
      await mutateMany(key => key.startsWith('key-'), 'hola', false);
    });

    expect(await findByText('hola hola 3')).toBeInTheDocument();
  });

  test('should allow replacing matching keys with revalidation', async () => {
    const { findByText } = renderTester();
    expect(await findByText('1 2 3')).toBeInTheDocument();

    await act(async () => {
      await mutateMany(key => key.startsWith('key-'), 'hola', true);
    });

    expect(await findByText('2 3 3')).toBeInTheDocument();
  });

  test('should allow replacing matching keys with dynamic revalidation based on the key', async () => {
    const { findByText } = renderTester();
    expect(await findByText('1 2 3')).toBeInTheDocument();

    await act(async () => {
      await mutateMany(
        key => key.startsWith('key-'),
        'hola',
        key => key === 'key-1'
      );
    });

    expect(await findByText('2 hola 3')).toBeInTheDocument();
  });

  test('should allow using glob instead of function to select keys', async () => {
    const { findByText } = renderTester();
    expect(await findByText('1 2 3')).toBeInTheDocument();

    await act(async () => {
      await mutateMany('key-*', 'hola', false);
    });
    expect(await findByText('hola hola 3')).toBeInTheDocument();
  });
});
