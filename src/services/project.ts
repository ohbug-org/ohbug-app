import { useAtom } from 'jotai'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import dayjs from 'dayjs'

import { currentProjectAtom } from '@/atoms'
import type { Project, ProjectTrend } from '@/types'
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
    (data) =>
      request<SwitchExtension, Project>(`/projects/switchExtension`, {
        method: 'POST',
        data,
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

const initialStart = dayjs().subtract(13, 'day').toISOString()
const initialEnd = dayjs().toISOString()
export function useGetProjectTrend(id?: number, start?: string, end?: string) {
  const { data } = useQuery<ProjectTrend>(
    [
      `/projects/trend`,
      {
        projectId: id,
        start: start ?? initialStart,
        end: end ?? initialEnd,
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
    (data) =>
      request<Create, Project>(key, {
        method: 'POST',
        data,
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
