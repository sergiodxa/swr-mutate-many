import { cache, mutate } from 'swr';
import globToRegExp from 'glob-to-regexp';

type mutateCallback<Data = any> = (currentValue: Data) => Data;

type select = string | ((key: string) => boolean);

function mutateMany<Data = any>(
  select: select,
  data?: Data | Promise<Data> | mutateCallback<Data>,
  shouldRevalidate:
    | boolean
    | ((key: string, currentValue: Data) => boolean) = true
): Promise<Data[]> {
  // get all cache keys
  const keys = cache.keys();

  const mutations = [];

  for (let key of keys) {
    // ignore keys which doesn't pass the condition
    if (typeof select === 'function' && !select(key)) continue;
    if (typeof select === 'string' && !globToRegExp(select).test(key)) {
      continue;
    }

    // get shouldRevalidate value
    const _shouldRevalidate =
      typeof shouldRevalidate === 'function'
        ? shouldRevalidate(key, cache.get(key))
        : shouldRevalidate;
    // call mutate and add the resulting promise to the mutations array
    mutations.push(mutate(key, data, _shouldRevalidate));
  }

  // returns the mutations array so we could wait for every mutation
  return Promise.all(mutations);
}

export { mutateMany };
