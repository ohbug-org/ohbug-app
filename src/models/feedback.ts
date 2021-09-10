import { createModel } from '@rematch/core'

import type { EventInAPP } from '@/types'
import type { RootModel } from '@/models'
import * as api from '@/api'

export interface FeedbackState {
  data?: EventInAPP<any>[]
  count?: number
  hasMore?: boolean
}

export const feedback = createModel<RootModel>()({
  state: {} as FeedbackState,
  reducers: {
    setFeedbacks(state, payload: [EventInAPP<any>[], number, boolean?]) {
      const feedbacks = payload
      const data = feedbacks[0]
      const count = feedbacks[1]
      const hasMore = feedbacks[2]
      return {
        ...state,
        data,
        count,
        hasMore,
      }
    },
  },
  effects: (dispatch) => ({
    async searchFeedbacks({
      page = 0,
      issueId,
      type,
      user,
      start,
      end,
    }: {
      page: number
      issueId?: number
      type?: string
      user?: string
      start?: number | string
      end?: number | string
    }) {
      const data = await api.feedback.getMany.call({
        page,
        issueId,
        type,
        user,
        start,
        end,
      })
      if (data) {
        dispatch.feedback.setFeedbacks(data)
      }
    },
  }),
})
