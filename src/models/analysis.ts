import { createModel } from '@rematch/core'
import dayjs from 'dayjs'

import type { RootModel } from '@/models'
import * as api from '@/api'

export interface AnalysisItem {
  item: string
  count: number
}
export type AnalysisState = Partial<{
  type: AnalysisItem[]
  device: AnalysisItem[]
  os: AnalysisItem[]
  browser: AnalysisItem[]
  event: number
  issue: number
  performance: {
    [key: string]: number
  }[]
}>

export const analysis = createModel<RootModel>()({
  state: {} as AnalysisState,
  reducers: {
    setState(state: AnalysisState, payload: AnalysisState) {
      return {
        ...state,
        ...payload,
      }
    },
  },
  effects: (dispatch) => ({
    async getStatistics({ type }) {
      const data = await api.analysis.get.call({
        type,
      })

      if (typeof data !== 'undefined') {
        dispatch.analysis.setState({
          [type]: data,
        })
      }
    },

    async getEventOrIssueStatistics({ type }) {
      // 取当天 event 总数
      const start = dayjs(dayjs().format('YYYY-MM-DD')).toISOString()
      const end = dayjs().toISOString()

      const data = await api.analysis.get.call({
        type,
        start,
        end,
      })

      if (typeof data !== 'undefined') {
        dispatch.analysis.setState({
          [type]: data,
        })
      }
    },

    async getPerformanceStatistics({ type }) {
      // 取当天 event 总数
      const start = dayjs(dayjs().format('YYYY-MM-DD')).toISOString()
      const end = dayjs().toISOString()

      const data = await api.analysis.get.call({
        start,
        end,
        type: 'performance',
        performanceType: type,
      })

      if (typeof data !== 'undefined') {
        dispatch.analysis.setState({
          performance: data,
        })
      }
    },
  }),
})
