import { createModel } from '@rematch/core'

import type { Project, ProjectTrend } from '@/types'
import type { RootModel } from '@/models'
import * as api from '@/api'
import { EffectReturn, navigate } from '@/ability'

export interface ProjectState {
  data?: Project[]
  current?: Project
  currentTrend?: ProjectTrend
}

export const project = createModel<RootModel>()({
  state: {
    current: undefined,
    data: undefined,
  } as ProjectState,
  reducers: {
    setState(state, payload: ProjectState) {
      return {
        ...state,
        ...payload,
      }
    },
    setCurrentProject(state, payload: number) {
      // eslint-disable-next-line eqeqeq
      const current = state.data!.find((v) => v.id == payload)
      if (current) {
        return {
          ...state,
          current,
        }
      }
      return state
    },
  },
  effects: (dispatch) => ({
    async create(
      { name, type }: { name: string; type: string },
      state
    ): EffectReturn<ProjectState['current']> {
      const data = await api.project.create.call({ name, type })
      dispatch.project.setState({
        data: [...(state.project.data || []), data],
        current: data,
      })
      navigate('/issue')

      return (_state) => _state.project.current
    },

    async get(): EffectReturn<ProjectState['current']> {
      try {
        const data = await api.project.getMany.call(null)

        const current = data[0]
        dispatch.project.setState({ data, current })

        return (state) => state.project.current
      } catch (error) {
        dispatch.project.setState({ data: undefined })

        return undefined
      }
    },

    async trend(
      { projectId, start, end }: { projectId?: number; start: Date; end: Date },
      state
    ): EffectReturn<ProjectState['currentTrend']> {
      const currentProject = state.project.current
      if (projectId || currentProject) {
        const data = await api.project.trend.call({
          projectId: projectId! || currentProject!.id!,
          start,
          end,
        })

        dispatch.project.setState({
          currentTrend: data,
        })

        return (_state) => _state.project.currentTrend
      }
      return undefined
    },

    async switchExtension(
      { extensionId, enabled }: { extensionId: number; enabled: boolean },
      state
    ): EffectReturn<ProjectState['current']> {
      const currentProject = state.project.current
      if (currentProject) {
        const data = await api.project.switchExtension.call({
          projectId: currentProject.id!,
          extensionId,
          enabled,
        })

        dispatch.project.setState({
          current: data,
        })

        return (_state) => _state.project.current
      }
      return undefined
    },
  }),
})
