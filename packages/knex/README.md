# @graft/knex

## Installation

```sh
yarn add @graft/knex
```

## Usage

### `primaryKey`

```ts
import {primaryKey} from '@graft/knex'

primaryKey = (
  table: Knex.CreateTableBuilder,
  name = 'id'
): Knex.ColumnBuilder
```

A Knex column builder that uses an incrementing integer primary key.

```ts
import {knex, primaryKey} from '@graft/knex'

await knex.schema.createTable('items', table => {
  primaryKey(table)
})
```

### `primaryUuid`

```ts
import {primaryUuid} from '@graft/knex'

primaryUuid = (
  knex: Knex,
  table: Knex.CreateTableBuilder,
  column = 'id'
): Knex.ColumnBuilder
```

A Knex column builder that uses a `uuid` as your primary key. It's often more efficient to use integers for your primary keys, but if you need something non-sequential for privacy or security Postgres has great `uuid` support through the `uuid-ossp` extension. This utility creates a unique `uuid` field defaulting to the column name 'id', using `uuid_generate_v4()` to generate default values.

```ts
import {knex, primaryUuid} from '@graft/knex'

await knex.schema.createTable('orders', table => {
  primaryUuid(knex, table)
})
```

To use, make sure to include this in your initial database migration:

```ts
import {knex} from '@graft/knex'

await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
```

### `foreignUuid`

```ts
import {foreignUuid} from '@graft/knex'

foreignUuid = (
  table: CreateTableBuilder,
  column: string,
  reference: {column: string; table: string},
  required?: boolean
): Knex.ColumnBuilder
```

This tool makes it easy to reference a `uuid` column in another table.

```ts
import {foreignUuid} from '@graft/knex'

foreignUuid(table, 'address', {
  column: 'id',
  table: 'address',
}).comment(`The Order''s Address.`)
```

### `updateTimestamp`

Defines a trigger on the given table to keep the `updated_at` field up to date.

```ts
import {updateTimestamp} from '@graft/knex'

await updateTimestamp(knex, 'vehicles')
```
