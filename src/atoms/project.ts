import { atom } from 'jotai'
import { atomWithQuery } from 'jotai/query'
import { atomWithStorage } from 'jotai/utils'

import type { Project } from '@/types'
import { request } from '@/ability'

export const projectsAtom = atomWithQuery<Project[], any>(() => ({
  queryKey: `/projects`,
  queryFn: request,
}))

const projectAtom = atomWithStorage<Project | null>('project', null)
export const currentProjectAtom = atom<Project, Project>(
  async (get) => (await get(projectAtom)) || (await get(projectsAtom))[0],
  (_, set, newData) => {
    set(projectAtom, newData)
  }
)
