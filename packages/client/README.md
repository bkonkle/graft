# @graft/client

## Installation

```sh
yarn add @graft/client
```

## Usage

### Utils

#### `getNodesFromConnection`

Get nodes from either a `nodes` property or an `edges` property on an object, stripping out any empty elements and cleaning up the TypeScript type.

```ts
import {getNodesFromConnection} from '@graft/client'

const comics = getNodesFromConnection(data.comicsByShopId)
```
