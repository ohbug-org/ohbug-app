import { atom } from 'recoil'

import type { Project } from '@/types'

export const projectsState = atom<Project[] | null>({
  key: 'projects',
  default: null,
})

export const currentProjectState = atom<Project | null>({
  key: 'currentProject',
  default: null,
})
