import type { Models } from '@rematch/core'

import { app } from './app'
import { event } from './event'
import { extension } from './extension'
import { issue } from './issue'
import { notification } from './notification'
import { project } from './project'
import { sourceMap } from './sourceMap'

export interface RootModel extends Models<RootModel> {
  app: typeof app
  event: typeof event
  issue: typeof issue
  extension: typeof extension
  notification: typeof notification
  project: typeof project
  sourceMap: typeof sourceMap
}

export const models: RootModel = {
  app,
  event,
  issue,
  extension,
  notification,
  project,
  sourceMap,
}

export * from './app'
export * from './event'
export * from './extension'
export * from './issue'
export * from './notification'
export * from './project'
export * from './sourceMap'
