import { createModel } from '@rematch/core'
import dayjs, { Dayjs } from 'dayjs'

import type { RootModel } from '@/models'
import * as api from '@/api'
import type { EffectReturn } from '@/ability'

interface MetaData {
  type: string
  message: string
  filename?: string
  stack?: string
  others?: string
  [key: string]: any
}
export interface Issue {
  id: number
  type: string
  intro: string
  createdAt: Date
  updatedAt: Date
  eventsCount: number
  usersCount: number
  metadata: MetaData
}
export interface Trend {
  issueId: string
  buckets: {
    timestamp: number
    count: number
  }[]
}
export interface IssueState {
  ranges: {
    当日: [Dayjs, Dayjs]
    近两周: [Dayjs, Dayjs]
  }
  searchRange: [Date, Date]
  current?: Issue
  data?: Issue[]
  count?: number
  trend?: {
    data?: Trend[]
    current?: {
      '24h': Trend
      '14d': Trend
    }
  }
}

const today = [dayjs().subtract(23, 'hour'), dayjs()]
const twoWeeks = [dayjs().subtract(13, 'day'), dayjs()]
const defaultValue = twoWeeks
export const issue = createModel<RootModel>()({
  state: {
    ranges: {
      当日: today,
      近两周: twoWeeks,
    },
    searchRange: [
      defaultValue[0].toISOString() as unknown as Date,
      defaultValue[1].toISOString() as unknown as Date,
    ],
  } as IssueState,
  reducers: {
    setRange(state, payload: IssueState['searchRange']) {
      return {
        ...state,
        searchRange: payload,
      }
    },
    setIssues(state, payload: { data: Issue[]; count: number }) {
      return {
        ...state,
        data: payload.data,
        count: payload.count,
      }
    },
    setTrends(state, payload: Trend[]) {
      return {
        ...state,
        trend: {
          ...state?.trend,
          data: payload,
        },
      }
    },
    setCurrentTrend(
      state,
      payload: {
        '24h': Trend
        '14d': Trend
      }
    ) {
      return {
        ...state,
        trend: {
          ...state?.trend,
          current: payload,
        },
      }
    },
    setCurrentIssue(state, payload: Issue) {
      return {
        ...state,
        current: payload,
      }
    },
  },
  effects: (dispatch) => ({
    async get({
      issueId,
    }: {
      issueId: number
    }): EffectReturn<IssueState['current']> {
      const data = await api.issue.get.call({
        issueId,
      })

      dispatch.issue.setCurrentIssue(data)

      return (state) => state.issue.current
    },

    async searchIssues(
      {
        projectId,
        page = 0,
        start,
        end,
      }: {
        projectId?: number
        page: number
        start?: Date
        end?: Date
      },
      state
    ): EffectReturn<IssueState | undefined> {
      const id = projectId || state.project.current?.id!
      if (start && end) {
        dispatch.issue.setRange([start, end])
      }
      const s = start ?? state.issue.searchRange[0]
      const e = end ?? state.issue.searchRange[1]

      await dispatch.project.trend({
        projectId: id,
        start: s,
        end: e,
      })

      const result = await api.issue.getMany.call({
        projectId: id,
        page,
        start: s,
        end: e,
      })

      const [data, count] = result
      dispatch.issue.setIssues({
        data,
        count,
      })
      const ids = data.map((v: Issue) => v.id)
      await dispatch.issue.getTrends({
        ids,
        period: '24h',
      })

      return (_state) => _state.issue
    },

    async getTrends({
      ids,
      period,
    }: {
      ids: number[]
      period: '24h' | '14d' | 'all'
    }): EffectReturn<IssueState['trend']> {
      const result = await api.issue.getTrend.call({
        ids,
        period,
      })

      dispatch.issue.setTrends(result)

      return (state) => state.issue.trend
    },

    async getCurrentTrend({
      ids,
      period,
    }: {
      ids: number[]
      period: '24h' | '14d' | 'all'
    }): EffectReturn<IssueState['trend']> {
      const [result] = await api.issue.getTrend.call({
        ids,
        period,
      })

      dispatch.issue.setCurrentTrend(result)

      return (state) => state.issue.trend
    },
  }),
})
