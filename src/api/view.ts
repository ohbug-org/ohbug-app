import { createApi } from '@/ability'
import type { GetPV, GetUV } from '@/models'

export const view = {
  getPV: createApi<GetPV, number>({
    url: '/view/pv',
    method: 'get',
  }),
  getUV: createApi<GetUV, number>({
    url: '/view/uv',
    method: 'get',
  }),
}
