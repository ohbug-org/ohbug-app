import { createModel } from '@rematch/core'

import type { Extension, ExtensionDetail } from '@/types'
import type { RootModel } from '@/models'
import * as api from '@/api'
import type { EffectReturn } from '@/ability'

export type ExtensionState = Partial<{
  data: Extension[]
  currentId: number
  current: ExtensionDetail
}>

export const extension = createModel<RootModel>()({
  state: {
    data: undefined,
    currentId: undefined,
    current: undefined,
  } as ExtensionState,
  reducers: {
    setState(state: ExtensionState, payload: ExtensionState) {
      return {
        ...state,
        ...payload,
      }
    },
  },
  effects: (dispatch) => ({
    async getMany(): EffectReturn<ExtensionState> {
      const [data] = await api.extension.getMany.call({ page: 0 })
      if (typeof data !== 'undefined') {
        const currentId = data?.[0].id!
        dispatch.extension.setState({
          data,
          currentId,
        })
        dispatch.extension.get({ extensionId: currentId })

        return (state) => state.extension
      }
      return undefined
    },
    async get({
      extensionId,
    }: {
      extensionId: number
    }): EffectReturn<ExtensionState['current']> {
      dispatch.extension.setState({
        currentId: extensionId,
      })
      const data = await api.extension.get.call({ extensionId })

      dispatch.extension.setState({
        current: data,
      })

      return (state) => state.extension.current
    },
  }),
})
