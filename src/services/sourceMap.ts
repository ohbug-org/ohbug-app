import { useMutation, useQuery, useQueryClient } from 'react-query'

import { createApi, request } from '@/ability'
import type { SourceMap } from '@/types'

export const sourceMap = {
  get: createApi<string, SourceMap[]>({
    url: (apiKey) => `/sourceMap/${apiKey}`,
    method: 'get',
    params: () => ({}),
  }),
  delete: createApi<number, SourceMap>({
    url: (sourceMapId) => `/sourceMap/${sourceMapId}`,
    method: 'delete',
    data: () => ({}),
  }),
}

export function useGetSourceMaps(apiKey?: string) {
  const { data } = useQuery<SourceMap[]>([`/sourceMap`, { apiKey }], {
    enabled: !!apiKey,
  })

  return { data }
}

interface DeleteSourceMap {
  apiKey?: string
  sourceMapId: number
}
export function useDeleteSourceMap() {
  const queryClient = useQueryClient()
  const mutation = useMutation<SourceMap, unknown, DeleteSourceMap>(
    (params) =>
      request<number, SourceMap>(`/sourceMap/${params.sourceMapId}`, {
        method: 'DELETE',
        // @ts-ignore
        params: {
          apiKey: params.apiKey,
        },
      }),
    {
      onSuccess() {
        queryClient.invalidateQueries(`/sourceMap`)
      },
    }
  )

  return {
    mutation,
  }
}
