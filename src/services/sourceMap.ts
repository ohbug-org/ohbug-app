import { useMutation, useQuery, useQueryClient } from 'react-query'

import { request } from '@/ability'
import type { SourceMap } from '@/types'

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
