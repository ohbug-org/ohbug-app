import { createModel } from '@rematch/core'

import type { RootModel } from '@/models'
import * as api from '@/api'

export interface ViewState {
  PV?: number
  UV?: number
}

export interface GetPV {
  start?: number | string
  end?: number | string
}
export type GetUV = GetPV

export const view = createModel<RootModel>()({
  state: {},
  reducers: {
    setPV(state, payload: number) {
      return {
        ...state,
        PV: payload,
      }
    },
    setUV(state, payload: number) {
      return {
        ...state,
        UV: payload,
      }
    },
  },
  effects: (dispatch) => ({
    async getPV({ start, end }) {
      const data = await api.view.getPV.call({
        start,
        end,
      })

      if (typeof data !== 'undefined') {
        dispatch.view.setPV(data)
      }
    },

    async getUV({ start, end }) {
      const data = await api.view.getUV.call({
        start,
        end,
      })

      if (typeof data !== 'undefined') {
        dispatch.view.setUV(data)
      }
    },
  }),
})
