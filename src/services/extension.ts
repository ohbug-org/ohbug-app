import { useQuery } from 'react-query'

import type { Extension, ExtensionDetail } from '@/types'

export function useGetExtensions() {
  type Result = [Extension[], number]
  const page = 0
  return useQuery<Result>([`/extensions`, { page }])
}

export function useGetExtension(id?: number) {
  type Result = ExtensionDetail
  return useQuery<Result>(`/extensions/${id}`, {
    enabled: !!id,
  })
}
