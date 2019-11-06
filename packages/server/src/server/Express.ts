import bodyParser from 'body-parser'
import chalk from 'chalk'
import cors from 'cors'
import http from 'http'
import jwt from 'express-jwt'
import jwks from 'jwks-rsa'
import noop from 'express-noop'
import playground from 'graphql-playground-middleware-express'
import {Application} from 'express'
import {MiddlewareOptions} from 'graphql-playground-html'
import {PostGraphileOptions, postgraphile} from 'postgraphile'

export interface GraftConfig {
  jwt: Omit<jwt.Options, 'secret'>
  jwks: jwks.ExpressJwtOptions
  playground?: MiddlewareOptions
  postgraphile: PostGraphileOptions
  database: {
    url?: string
    name?: string
  }
  cors?: cors.CorsOptions
  dev?: boolean
}

export function withGraft(app: Application, config: GraftConfig) {
  const jwtCheck = jwt({
    ...config.jwt,
    secret: jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      ...config.jwks,
    }),
  })

  const playgroundMiddleware = playground({
    endpoint: '/graphql',
    settings: {
      // @ts-ignore - incomplete type
      'schema.polling.enable': false,
    },
    ...config.playground,
  })

  const pgMiddleware = postgraphile(
    config.database.url,
    config.database.name || 'public',
    {
      dynamicJson: true,
      setofFunctionsContainNulls: false,
      ...config.postgraphile,
    }
  )

  return app
    .get('/graphql', noop(config.dev, playgroundMiddleware))
    .use(jwtCheck)
    .use(cors(config.cors))
    .use(bodyParser.json())
    .use(pgMiddleware)
}

export function run(app: Application, port: number, appName?: string) {
  const server = http.createServer(app)

  server.listen(port, () => {
    console.log(
      chalk.cyan(
        `> Started ${appName || 'GraphQL API'} on port ${chalk.yellow(
          port.toString()
        )}`
      )
    )
  })

  server.on('close', () => {
    console.log(chalk.cyan(`> ${appName || 'GraphQL API'} shutting down`))
  })
}
