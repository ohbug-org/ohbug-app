import { init, RematchDispatch, RematchRootState } from '@rematch/core'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import type { BaseOptions } from '@ahooksjs/use-request/lib/types'

import { useRequest } from '@/hooks'
import { models, RootModel } from '@/models'

export const store = init<RootModel>({
  models,
})

export type Store = typeof store
export type Dispatch = RematchDispatch<RootModel>
export type RootState = RematchRootState<RootModel>

export * from 'redux'
export * from 'react-redux'

export type EffectReturn<T> = Promise<((state: RootState) => T) | undefined>

export function useModelState<T>(selector: (state: RootState) => T) {
  return useSelector<RootState, T>(selector)
}

export function useModelDispatch<T>(selector: (dispatch: Dispatch) => T) {
  const dispatch = useDispatch<Dispatch>()
  return selector(dispatch)
}

/**
 * @description 对 rematch 的 model 使用进行封装，结合 model 与 useRequest 的能力。
 * 一个 hook 管理一个 dispatch 的 状态，完美取代了 rematch loading plugin 的能力，并且更加易用。
 * @example const { data, error, loading } = useModelEffect(dispatch => dispatch.project.get)
 */
export function useModelEffect<R, P extends any[]>(
  mapDispatch: (dispatch: Dispatch) => (...params: P) => EffectReturn<R>,
  options?: BaseOptions<R, P>
) {
  const dispatch = useDispatch<Dispatch>()
  const targetDispatch = mapDispatch(dispatch)

  const { data, ...otherResult } = useRequest<R, P>(targetDispatch, options)

  const state = useSelector<RootState, R>(
    data ?? ((() => {}) as any),
    shallowEqual
  )

  return {
    data: state,
    ...otherResult,
  }
}
