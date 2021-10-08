import type { OhbugEvent, OhbugUser } from '@ohbug/types'
import type { Result } from 'source-map-trace/dist/interfaces'

export type OhbugEventLike = OhbugEvent<any>

export type { OhbugUser }

export interface EventWithNeighbor<T> extends OhbugEvent<T> {
  previous: { id: number }
  next: { id: number }
}

export interface EventInAPP<T> extends OhbugEvent<T> {
  // source
  source?: Result
  next?: { id: number }
  previous?: { id: number }
}
