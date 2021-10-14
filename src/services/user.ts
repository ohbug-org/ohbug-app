import { useAtom } from 'jotai'
import { useMutation, useQuery, useQueryClient } from 'react-query'

import { userAtom } from '@/atoms'
import type { User } from '@/types'
import { request } from '@/ability'

interface Login {
  name: string
  password: string
}
export function useLogin() {
  return useMutation<User, unknown, Login>((data) =>
    request<Login, User>(`/users/login`, {
      method: 'POST',
      data,
    })
  )
}

export function useGetUser(id: number) {
  const [, setUser] = useAtom(userAtom)
  return useQuery<User>(`/users/${id}`, {
    enabled: !!id,
    onSuccess(data) {
      if (data?.id !== undefined) {
        setUser(data)
      }
    },
  })
}

interface UpdatePassword {
  id: number
  password: string
  oldPassword: string
}
export function useUpdatePassword() {
  const [, setUser] = useAtom(userAtom)
  const queryClient = useQueryClient()
  return useMutation<User, unknown, UpdatePassword>(
    (data) =>
      request<UpdatePassword, User>(`/users/password`, {
        method: 'PATCH',
        data,
      }),
    {
      onSuccess(data) {
        if (data?.id !== undefined) {
          setUser(data)
          queryClient.invalidateQueries(`/users/${data.id}`)
        }
      },
    }
  )
}
