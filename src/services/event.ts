import { useQuery } from 'react-query'

import type { EventInAPP } from '@/types'

export function useGetEvent(id: number | 'latest', issueId: number) {
  const { data } = useQuery<EventInAPP<any>>([`/events/${id}`, { issueId }], {
    enabled: !!id && !!issueId,
  })

  return { data }
}
