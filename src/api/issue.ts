import { createApi } from '@/ability'
import type { Issue } from '@/models'

interface Get {
  issueId: number
}
interface GetMany {
  projectId: number
  page: number
  start?: Date
  end?: Date
}
type Period = '24h' | '14d' | 'all'
interface GetTrend {
  ids: number[]
  period: Period
}

export const issue = {
  get: createApi<Get, Issue>({
    url: ({ issueId }) => `/issues/${issueId}`,
    method: 'get',
    params: () => ({}),
  }),
  getMany: createApi<GetMany, [Issue[], number]>({
    url: '/issues',
    method: 'get',
  }),
  getTrend: createApi<GetTrend, any>({
    url: '/issues/trend',
    method: 'post',
  }),
}
