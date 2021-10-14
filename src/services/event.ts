import { useQuery } from 'react-query'

import type { EventInAPP } from '@/types'

export function useGetEvent(id: number | 'latest', issueId: number) {
  return useQuery<EventInAPP<any>>([`/events/${id}`, { issueId }], {
    enabled: !!id && !!issueId,
  })
}
