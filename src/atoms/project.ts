import { atom } from 'jotai'
import { atomWithQuery } from 'jotai/query'
import { atomWithStorage } from 'jotai/utils'

import type { Project } from '@/types'
import { request } from '@/ability'

export const projectsAtom = atomWithQuery<Project[], any>(() => ({
  queryKey: `/projects`,
  queryFn: request,
}))

const defaultStorage = {
  getItem(key: string) {
    const storedValue = sessionStorage.getItem(key)
    if (storedValue === null) {
      throw new Error('no value stored')
    }
    return JSON.parse(storedValue)
  },
  setItem(key: string, newValue: unknown) {
    return sessionStorage.setItem(key, JSON.stringify(newValue))
  },
}
const projectAtom = atomWithStorage<Project | null>(
  'project',
  null,
  defaultStorage
)
export const currentProjectAtom = atom<Project, Project>(
  async (get) => (await get(projectAtom)) || (await get(projectsAtom))?.[0],
  (_, set, newData) => {
    set(projectAtom, newData)
  }
)
