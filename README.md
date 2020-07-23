# SWR Mutate Many

![CI](https://github.com/sergiodxa/swr-mutate-many/workflows/CI/badge.svg)
![Publish](https://github.com/sergiodxa/swr-mutate-many/workflows/Publish/badge.svg)
[![Maintainability](https://api.codeclimate.com/v1/badges/ca0f1ecf8819788f7811/maintainability)](https://codeclimate.com/github/sergiodxa/swr-mutate-many/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/ca0f1ecf8819788f7811/test_coverage)](https://codeclimate.com/github/sergiodxa/swr-mutate-many/test_coverage)

Little function to call mutate against multiple cached keys of SWR.

## Usage

Install it

```sh
$ yarn add swr swr-mutate-many
```

Import it and use it

```ts
import { mutateMany } from 'swr-mutate-many';

mutateMany('key-*', 'New Value', false);
```

Now mutateMany will change the value of any key matching the glob `key-*` (any starting with `key-`) to have the value `"New Value"` and it won't trigger a revalidation.

## API

mutateMany follow a similar API as SWR mutate.

1. The key to mutate, in our case it could be:

- A string supporting globs to match the key, useful for simple logic
- A function which will receive the key and should return true/false if it matches, useful for complex logic

2. The new value to use, a promise whose resolved value will be used or a function receiving the current value
3. If the keys should be revalidated, in our case it could be:

- A boolean, as in mutate, useful if you want all to revalidate or not
- A function, which will receive the key and return a boolean, useful for complext logic
