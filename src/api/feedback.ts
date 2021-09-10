import type { EventInAPP } from '@/types'
import { createApi } from '@/ability'

interface GetMany {
  page: number
  issueId?: number
  type?: string
  user?: string
  start?: number | string
  end?: number | string
}

export const feedback = {
  getMany: createApi<GetMany, [EventInAPP<any>[], number]>({
    url: '/feedback',
    method: 'get',
  }),
}
