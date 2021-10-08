import { useMutation, useQuery, useQueryClient } from 'react-query'

import { request } from '@/ability'
import type { SourceMap } from '@/types'

export function useGetSourceMaps(apiKey?: string) {
  return useQuery<SourceMap[]>([`/sourceMap`, { apiKey }], {
    enabled: !!apiKey,
  })
}

interface DeleteSourceMap {
  apiKey?: string
  sourceMapId: number
}
export function useDeleteSourceMap() {
  const queryClient = useQueryClient()
  return useMutation<SourceMap, unknown, DeleteSourceMap>(
    (params) =>
      request<number, SourceMap>(`/sourceMap/${params.sourceMapId}`, {
        method: 'DELETE',
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
}
