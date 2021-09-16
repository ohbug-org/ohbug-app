import { createModel } from '@rematch/core'

import type { RootModel } from '@/models'
import * as api from '@/api'
import type { EffectReturn } from '@/ability'
import type { SourceMap } from '@/types'

export interface SourceMapState {
  data?: SourceMap[]
}

export const sourceMap = createModel<RootModel>()({
  state: {
    data: undefined,
  } as SourceMapState,
  reducers: {
    setState(state, payload: SourceMapState) {
      return {
        ...state,
        ...payload,
      }
    },
  },
  effects: (dispatch) => ({
    async get(_, state): EffectReturn<SourceMapState['data']> {
      const project = state.project.current
      if (project) {
        const data = await api.sourceMap.get.call(project.apiKey)

        dispatch.sourceMap.setState({
          data,
        })

        return (_state) => _state.sourceMap.data
      }
      return undefined
    },

    async delete({
      sourceMapId,
    }: {
      sourceMapId: number
    }): EffectReturn<SourceMapState['data']> {
      if (sourceMapId) {
        await api.sourceMap.delete.call(sourceMapId)

        return dispatch.sourceMap.get()
      }
      return undefined
    },
  }),
})
