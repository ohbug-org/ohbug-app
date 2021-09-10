import type { Project } from '@/types'
import { createApi } from '@/ability'

interface Get {
  projectId: number
}
interface Create {
  name: string
  type: string
}
interface Trend {
  projectId: number
  start: Date
  end: Date
}
interface SwitchExtension {
  projectId: number
  extensionId: number
  enabled: boolean
}

export const project = {
  create: createApi<Create, Project>({
    url: '/projects',
    method: 'post',
  }),
  get: createApi<Get, Project>({
    url: ({ projectId }) => `/projects/${projectId}`,
    method: 'get',
    params: () => ({}),
  }),
  getMany: createApi<null, Project[]>({
    url: '/projects',
    method: 'get',
  }),
  trend: createApi<Trend, any>({
    url: `/projects/trend`,
    method: 'post',
    data: ({ projectId, start, end }) => ({ projectId, start, end }),
  }),
  switchExtension: createApi<SwitchExtension, Project>({
    url: '/projects/switchExtension',
    method: 'post',
  }),
}
