# Graft Server Tools

Graft includes a set of server tools, including a convenience wrapper for Express called `withGraft`. By default, you can get up and running with a minimal configuration and Graft will use a set of sensible defaults.

## Installation

```sh
yarn add @graft/server
```

## Usage

To quickly get up and running, install Graft Server and some local dependencies:

```sh
yarn add @graft/server express morgan
```

Then define a Graft config:

```ts
import {GraftConfig} from '@graft/server'

async function pgSettings(req: IncomingMessage) {
  const sub = req.user && req.user.sub

  return {
    'jwt.claims.sub': sub,
    role: 'app_user',
  }
}

const getGraphQLContext = async (req: IncomingMessage) => ({
  user: req.user,
})

const plugins = []

const config: GraftConfig = {
  postgraphile: {
    appendPlugins: plugins,
    additionalGraphQLContextFromRequest: getGraphQLContext,
    pgSettings: pgSettings,
    retryOnInitFail: true,
  },
  jwt: {
    audience: Auth.audience,
    issuer: Auth.issuer,
    algorithms: ['RS256'],
    credentialsRequired: false,
  },
  jwks: {
    jwksUri: Auth.jwksUri,
  },
  cors: {
    allowedHeaders: Server.corsHeaders,
  },
  database: {
    url: Database.url,
  },
}
```

Then, define an Express app and run it with Graft's helpers (which we'll place in `src/Server.ts` for the purpose of this example):

```ts
import express from 'express'
import morgan from 'morgan'
import {withGraft, run} from '@graft/server'

export function start() {
  const app = express()
    .disable('x-powered-by')
    .use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'))
    .get('/', (_req, res) => {
      res.send('ok')
    })

  run(withGraft(app, config), 4000)
}

if (require.main === module) {
  start()
}
```

Since we're using TypeScript, install the dev dependency `ts-node`:

```
yarn add --dev ts-node
```

Finish up with a "dev" script in your _package.json_ file:

```json
{
  "script": {
    "dev": "NODE_ENV=development ts-node --transpile-only src/Server.ts"
  }
}
```

In the example above, we used port 4000, so run `yarn dev` and visit http://localhost:4000/graphql to see the default Playground interface.

Graft will use PostGraphile to introspect your PostgreSQL database and auto-generate a very useful default interface for managing data in your tables and columns.

### Schema

To find helpers for managing your database schema with Knex, take a look at the [@graft/knex](../packages/knex) package.

### Utils

To find helpers for working with PostGraphile and implementing business logic for your server, take a look at the [utils](src/utils) folder.
