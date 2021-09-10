import { createApi } from '@/ability'
import type { SourceMap } from '@/models'

export const sourceMap = {
  get: createApi<string, SourceMap[]>({
    url: (apiKey) => `/sourceMap/${apiKey}`,
    method: 'get',
    params: () => ({}),
  }),
  delete: createApi<number, SourceMap>({
    url: (sourceMapId) => `/sourceMap/${sourceMapId}`,
    method: 'delete',
    data: () => ({}),
  }),
}
