import { Extension, ExtensionDetail } from '@/types'
import { createApi } from '@/ability'

interface GetMany {
  page?: number
}
interface Get {
  extensionId: number
}

export const extension = {
  getMany: createApi<GetMany, [Extension[], number]>({
    url: '/extensions',
    method: 'get',
  }),
  get: createApi<Get, ExtensionDetail>({
    url: ({ extensionId }) => `/extensions/${extensionId}`,
    method: 'get',
    params: () => ({}),
  }),
}
