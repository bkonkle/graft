# Graft

_Massively Maintainable GraphQL_

## Overview

Graft is a companion library for [PostGraphile](https://www.graphile.org/postgraphile/), offering opinionated tools for working with PostGraphile's outstanding [PostgreSQL](https://www.postgresql.org/) + [GraphQL](https://graphql.org/) solution in an efficient and easy-to-maintain way.

Over time, the hope is that this will grow into a rich set of community tools that make database-first development easy and scalable!

## Server Tools

### Installation

```sh
yarn add @graft/server postgraphile pg knex
```

### Usage

#### PostGraphileUtils

##### `query`

Execute a Query against PostGraphile's internal schema. This allows you to use PostGraphile internally and take advantage of GraphQL's expressive syntax for your API business logic.

```ts
import {query} from '@graft/server`

import {
  AllMountainsQuery,
  AllMountainsQueryVariables,
  AllMountainsDocument,
  MountainClasses,
  MountainOrderBy,
} from './Schema.ts'

const fourteeners = await query<AllMountainsQuery, AllMountainsQueryVariables>(
  request,
  {
    query: AllMountainsDocument,
    variables: {
      condition: {
        class: MountainClasses.Fourteener,
      },
      orderBy: MountainOrderBy.NameAsc,
    },
  }
)
```

##### `mutation`

Execute a Mutation against PostGraphile's internal schema.

```ts
import {mutation} from '@graft/server`

import {
  UpdateMountainByIdMutation,
  UpdateMountainByIdMutationVariables,
  UpdateMountainByIdDocument,
  UsStates,
} from './Schema.ts'

const result = await mutate<
  UpdateMountainByIdMutation,
  UpdateMountainByIdMutationVariables
>(request, {
  mutation: UpdateMountainByIdDocument,
  variables: {
    input: {
      mountain: {
        state: UsStates.Colorado,
      },
    },
  },
})
```

##### `createRequest`

A utility to conveniently package up everything needed by the `query` and `mutation` functions and give everything a clean and easy-to-use type.

```ts
import {createRequest} from '@graft/server'

// ... makeExtendSchemaPlugin
  resolvers: {
    Mutation: {
      markMessagesRead: async (_query, args, context: Context, resolveInfo) => {
        const request = createRequest(context, resolveInfo)

        // ... your operation here
      },
    },
  },
```

#### KnexUtils

##### `primaryKey`

```ts
primaryKey = (
  table: Knex.CreateTableBuilder,
  name = 'id'
): Knex.ColumnBuilder
```

A Knex column builder that uses an incrementing integer primary key.

```ts
import {KnexUtils} from '@graft/server'

await knex.schema.createTable('items', table => {
  KnexUtils.primaryKey(table)
})
```

##### `primaryUuid`

```ts
primaryUuid = (
  knex: Knex,
  table: Knex.CreateTableBuilder,
  column = 'id'
): Knex.ColumnBuilder
```

A Knex column builder that uses a `uuid` as your primary key. It's often more efficient to use integers for your primary keys, but if you need something non-sequential for privacy or security Postgres has great `uuid` support through the `uuid-ossp` extension. This utility creates a unique `uuid` field defaulting to the column name 'id', using `uuid_generate_v4()` to generate default values.

```ts
import {KnexUtils} from '@graft/server'

await knex.schema.createTable('orders', table => {
  KnexUtils.primaryUuid(knex, table)
})
```

To use, make sure to include this in your initial database migration:

```ts
await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
```

##### `foreignUuid`

```ts
foreignUuid = (
  table: CreateTableBuilder,
  column: string,
  reference: {column: string; table: string},
  required?: boolean
): Knex.ColumnBuilder
```

This tool makes it easy to reference a `uuid` column in another table.

```ts
import {KnexUtils} from '@graft/server'

KnexUtils.foreignUuid(table, 'address', {
  column: 'id',
  table: 'address',
}).comment(`The Order''s Address.`)
```

##### `updateTimestamp`

Defines a trigger on the given table to keep the `updated_at` field up to date.

```ts
import {KnexUtils} from '@graft/server'

await KnexUtils.updateTimestamp(knex, 'vehicles')
```

## Client Tools

### Installation

```sh
yarn add @graft/client
```

### Usage

#### Utils

##### `getNodesFromConnection`

Get nodes from either a `nodes` property or an `edges` property on an object, stripping out any empty elements and cleaning up the TypeScript type.

```ts
import {getNodesFromConnection} from '@graft/client`

const comics = getNodesFromConnection(data.comicsByShopId)
```
