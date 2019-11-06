import {RequestHandler} from 'express'

declare module 'express-noop' {
  function noop(
    condition?: boolean,
    middleware?: RequestHandler
  ): RequestHandler

  export = noop
}
