import type { EventInAPP } from '@/types'
import { createApi } from '@/ability'

interface Get {
  eventId: string | number
  issueId: string | number
}
interface GetLatest {
  issueId: string | number
}

export const event = {
  get: createApi<Get, EventInAPP<any>>({
    url: ({ eventId }) => `/events/${eventId}`,
    method: 'get',
    params: ({ issueId }) => ({
      issueId,
    }),
  }),
  getLatest: createApi<GetLatest, EventInAPP<any>>({
    url: '/events/latest',
    method: 'get',
    params: ({ issueId }) => ({
      issueId,
    }),
  }),
}
