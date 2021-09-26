import { useSetRecoilState } from 'recoil'
import { useQuery, useMutation } from 'react-query'
import dayjs from 'dayjs'

import { projectsState, currentProjectState } from '@/states'
import type { Project } from '@/types'
import { request } from '@/ability'

export function useGetProjects() {
  const { data, isLoading } = useQuery<Project[]>(`/projects`, {
    suspense: false,
  })
  const setProjectsState = useSetRecoilState(projectsState)
  const setCurrentProjectState = useSetRecoilState(currentProjectState)

  if (data) {
    setProjectsState(data)
    setCurrentProjectState(data[0])
  }

  return {
    data,
    isLoading,
  }
}

export function useGetProject(id: number) {
  const { data } = useQuery<Project>(`/projects/${id}`)
  const setCurrentProjectState = useSetRecoilState(currentProjectState)

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
  const setCurrentProjectState = useSetRecoilState(currentProjectState)
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
  const setProjectsState = useSetRecoilState(projectsState)
  const setCurrentProjectState = useSetRecoilState(currentProjectState)
  const mutation = useMutation<Project, unknown, Create>(
    (body) =>
      request<Create, Project>(`/projects`, {
        method: 'POST',
        body,
      }),
    {
      onSuccess(data) {
        if (data) {
          setProjectsState((prevData) => [...(prevData || []), data])
          setCurrentProjectState(data)
        }
      },
    }
  )

  return {
    mutation,
  }
}
