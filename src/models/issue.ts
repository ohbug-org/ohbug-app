import { createModel } from '@rematch/core'
import dayjs, { Dayjs } from 'dayjs'

import type { Issue } from '@/types'
import type { RootModel } from '@/models'
import * as api from '@/api'
import type { EffectReturn } from '@/ability'

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
  searchCondition: {
    range?: [Date, Date]
    type?: string
  }
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
    searchCondition: {
      range: [
        defaultValue[0].toISOString() as unknown as Date,
        defaultValue[1].toISOString() as unknown as Date,
      ],
    },
  } as IssueState,
  reducers: {
    setSearchCondition(state, payload: IssueState['searchCondition']) {
      return {
        ...state,
        searchCondition: {
          ...state.searchCondition,
          ...payload,
        },
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
        type,
      }: {
        projectId?: number
        page?: number
        start?: Date
        end?: Date
        type?: string
      },
      state
    ): EffectReturn<IssueState | undefined> {
      const id = projectId || state.project.current?.id!
      if (start && end) {
        dispatch.issue.setSearchCondition({ range: [start, end] })
      }
      const s = start ?? state.issue.searchCondition?.range?.[0]
      const e = end ?? state.issue.searchCondition?.range?.[1]
      const t = type ?? state.issue.searchCondition.type

      await dispatch.project.trend({
        projectId: id,
        start: s!,
        end: e!,
      })

      const result = await api.issue.getMany.call({
        projectId: id,
        page,
        start: s,
        end: e,
        type: t,
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
