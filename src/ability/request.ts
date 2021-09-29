/**
 * 封装 request
 * 根据服务端返回的 showType 自动展示对应的提示
 */
import type { QueryFunctionContext } from 'react-query'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { message, notification } from 'antd'

import { ResponseStructure, ErrorShowType } from '@/types'

import { navigate } from '@/ability'

axios.defaults.baseURL = `/api/v1`
axios.defaults.timeout = 10000

export const request = <P extends {} = {}, R = any>(
  context: string | QueryFunctionContext,
  config?: AxiosRequestConfig
) => {
  let resource = context
  let params: P | undefined
  if (typeof context === 'object' && Array.isArray(context.queryKey)) {
    // @ts-ignore
    ;[resource, params] = context.queryKey
  }
  if (config?.params) {
    params = config.params
  }

  const cancelToken = axios.CancelToken
  const source = cancelToken.source()

  const promise = axios(resource as string, {
    ...config,
    params: { ...config?.params, ...params },
    cancelToken: source.token,
  }).then((response: AxiosResponse<ResponseStructure<R>>) => {
    const result = response.data
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
    }

    message.error('Request error, please retry.')
    throw new Error(result.errorMessage)
  })

  // @ts-ignore
  promise.cancel = () => source.cancel('Query was cancelled by React Query')

  return promise
}
