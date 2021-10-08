import { useQuery } from 'react-query'

import type { Issue } from '@/types'

export function useGetIssue(id?: number) {
  return useQuery<Issue>(`/issues/${id}`, {
    enabled: !!id,
  })
}

interface GetMany {
  projectId: number | undefined
  page: number
  start?: string
  end?: string
  type?: string
}
export function useGetIssues(params: GetMany) {
  return useQuery<[Issue[], number]>([`/issues`, params], {
    enabled: !!params.projectId,
    keepPreviousData: true,
  })
}

type Period = '24h' | '14d' | 'all'
interface GetTrend {
  ids?: number[]
  period: Period
}
interface TrendData {
  issueId: string
  buckets: {
    timestamp: string
    count: number
  }[]
}
type Trend = TrendData & {
  '14d': TrendData
  '24h': TrendData
}
export function useGetIssuesTrend(params: GetTrend) {
  return useQuery<Trend[]>([`/issues/trend`, params], {
    enabled: Array.isArray(params.ids) && !!params.ids.length,
  })
}
