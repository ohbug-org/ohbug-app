import { useQuery } from 'react-query'

import type { Extension, ExtensionDetail } from '@/types'

export function useGetExtensions() {
  type Result = [Extension[], number]
  const page = 0
  const { data } = useQuery<Result>([`/extensions`, { page }])

  return {
    data,
  }
}

export function useGetExtension(id?: number) {
  type Result = ExtensionDetail
  const { data } = useQuery<Result>(`/extensions/${id}`, {
    enabled: !!id,
  })

  return {
    data,
  }
}
