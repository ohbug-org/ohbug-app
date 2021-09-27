/**
 * 封装 request
 * 根据服务端返回的 showType 自动展示对应的提示
 */
import type { QueryFunctionContext } from 'react-query'
import { message, notification } from 'antd'
import qs from 'query-string'

import { ResponseStructure, ErrorShowType } from '@/types'

import { navigate } from '@/ability'

export const request = <P extends {} = {}, R = any>(
  context: string | QueryFunctionContext<[string, unknown]>,
  init?: Omit<RequestInit, 'body'> & { body?: P } & { params?: P }
) => {
  let resource = context
  let params: Record<string, any>
  if (typeof context === 'object' && Array.isArray(context.queryKey)) {
    // @ts-ignore
    ;[resource, params] = context.queryKey
  }
  if (init?.params) {
    params = init.params
  }
  const baseURL = '/api/v1'
  // @ts-ignore
  const url = params
    ? `${baseURL}${resource}?${qs.stringify(params, { arrayFormat: 'index' })}`
    : `${baseURL}${resource}`

  const controller = new AbortController()
  const { signal } = controller

  const promise = fetch(url, {
    ...init,
    body: JSON.stringify(init?.body),
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
    signal,
  })
    .then((res) => res.json())
    .then((result: ResponseStructure<R>) => {
      if (result.success && typeof result.data !== 'undefined') {
        return result.data as R
      }
      if (result) {
        const { errorMessage, errorCode } = result
        const msg =
          errorCode !== undefined
            ? `[${errorCode}]: ${errorMessage}`
            : errorMessage
        switch (result.showType) {
          case ErrorShowType.SILENT:
            break
          case ErrorShowType.WARN_MESSAGE:
            message.warn(msg)
            break
          case ErrorShowType.ERROR_MESSAGE:
            message.error(msg)
            break
          case ErrorShowType.NOTIFICATION:
            notification.open({
              message: msg,
            })
            break
          case ErrorShowType.REDIRECT:
            navigate('/403', { state: errorCode })
            break
          default:
            message.error(msg)
            break
        }
      } else {
        message.error('Request error, please retry.')
      }

      // @ts-ignore
      throw new Error(result)
    })

  // @ts-ignore
  promise.cancel = () => controller.abort()

  return promise
}
