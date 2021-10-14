import { atomWithStorage } from 'jotai/utils'

import type { User } from '@/types'

export const userAtom = atomWithStorage<User | null>('user', null)
