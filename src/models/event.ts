import { createModel } from '@rematch/core'

import type { EventInAPP } from '@/types'
import type { RootModel } from '@/models'
import * as api from '@/api'
import { EffectReturn } from '@/ability'

export interface EventState {
  current?: EventInAPP<any>
}

export const event = createModel<RootModel>()({
  state: {} as EventState,
  reducers: {
    setCurrentEvent(state, payload: EventInAPP<any>) {
      return {
        ...state,
        current: payload,
      }
    },
  },
  effects: (dispatch) => ({
    async get({
      eventId,
      issueId,
    }: {
      eventId: number
      issueId: number
    }): EffectReturn<EventState['current']> {
      const data = await api.event.get.call({
        eventId,
        issueId,
      })

      dispatch.event.setCurrentEvent(data)

      return (state) => state.event.current
    },

    async getLatestEvent({
      issueId,
    }: {
      issueId: number
    }): EffectReturn<EventState['current']> {
      const data = await api.event.getLatest.call({
        issueId,
      })

      dispatch.event.setCurrentEvent(data)

      return (state) => state.event.current
    },
  }),
})
