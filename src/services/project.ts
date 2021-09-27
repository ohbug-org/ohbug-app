import { useAtom } from 'jotai'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import dayjs from 'dayjs'

import { currentProjectAtom } from '@/atoms'
import type { Project } from '@/types'
import { request } from '@/ability'

export function useGetProject(id: number) {
  const { data } = useQuery<Project>(`/projects/${id}`)
  const [, setCurrentProjectState] = useAtom(currentProjectAtom)

  if (data) {
    setCurrentProjectState(data)
  }

  return {
    data,
  }
}

interface SwitchExtension {
  projectId: number
  extensionId: number
  enabled: boolean
}
export function useSwitchExtension() {
  const [, setCurrentProjectState] = useAtom(currentProjectAtom)
  const mutation = useMutation<Project, unknown, SwitchExtension>(
    (body) =>
      request<SwitchExtension, Project>(`/projects/switchExtension`, {
        method: 'POST',
        body,
      }),
    {
      onSuccess(data) {
        if (data) {
          setCurrentProjectState(data)
        }
      },
    }
  )

  return {
    mutation,
  }
}

export function useGetProjectTrend(id?: number) {
  const start = dayjs()
    .subtract(13, 'day')
    .startOf('day')
    .toISOString() as unknown as Date
  const end = dayjs().startOf('day').toISOString() as unknown as Date
  const { data } = useQuery<any>(
    [
      `/projects/trend`,
      {
        projectId: id,
        start,
        end,
      },
    ],
    { enabled: !!id }
  )

  return { data }
}

interface Create {
  name: string
  type: string
}
export function useCreateProject() {
  const queryClient = useQueryClient()
  const key = `/projects`
  const [, setCurrentProjectState] = useAtom(currentProjectAtom)
  const mutation = useMutation<Project, unknown, Create>(
    (body) =>
      request<Create, Project>(key, {
        method: 'POST',
        body,
      }),
    {
      onSuccess(data) {
        setCurrentProjectState(data)
        queryClient.invalidateQueries(key)
      },
    }
  )

  return {
    mutation,
  }
}
