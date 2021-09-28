import { useMutation, useQuery, useQueryClient } from 'react-query'

import { request } from '@/ability'
import type {
  NotificationRule,
  NotificationRuleBlackList,
  NotificationRuleData,
  NotificationRuleWhiteList,
  NotificationSettingWebHook,
  NotificationSettingBrowser,
  NotificationSettingEmails,
  NotificationSettingWebHookType,
  NotificationSetting,
} from '@/types'

type Level = 'serious' | 'warning' | 'default'
interface Base {
  projectId?: number
}

export function useGetRules(params: Base) {
  const { data } = useQuery<NotificationRule[]>(
    [`/notification/rules`, params],
    {
      enabled: !!params.projectId,
    }
  )

  return { data }
}

export interface CreateRule extends Base {
  name: string
  data: NotificationRuleData
  whiteList?: NotificationRuleWhiteList
  blackList?: NotificationRuleBlackList
  level: Level
  interval: number
  open: boolean
}
export function useCreateRule() {
  const queryClient = useQueryClient()
  const key = `/notification/rules`
  const mutation = useMutation<NotificationRule, unknown, CreateRule>(
    (data) =>
      request<CreateRule, NotificationRule>(key, {
        method: 'POST',
        data,
      }),
    {
      onSuccess() {
        queryClient.invalidateQueries(key)
      },
    }
  )

  return {
    mutation,
  }
}

export interface UpdateRule extends Base {
  ruleId: number
  name?: string
  data?: string
  whiteList?: string
  blackList?: string
  level?: Level
  interval?: number
  open?: boolean
}
export function useUpdateRule() {
  const queryClient = useQueryClient()
  const mutation = useMutation<NotificationRule, unknown, UpdateRule>(
    (data) =>
      request<UpdateRule, NotificationRule>(
        `/notification/rules/${data.ruleId}`,
        {
          method: 'PATCH',
          data,
        }
      ),
    {
      onSuccess() {
        queryClient.invalidateQueries(`/notification/rules`)
      },
    }
  )

  return {
    mutation,
  }
}

export interface DeleteRule extends Base {
  ruleId: number
}
export function useDeleteRule() {
  const queryClient = useQueryClient()
  const mutation = useMutation<NotificationRule, unknown, DeleteRule>(
    (params) =>
      request<UpdateRule, NotificationRule>(
        `/notification/rules/${params.ruleId}`,
        {
          method: 'DELETE',
          // @ts-ignore
          params: {
            projectId: params.projectId,
          },
        }
      ),
    {
      onSuccess() {
        queryClient.invalidateQueries(`/notification/rules`)
      },
    }
  )

  return {
    mutation,
  }
}

export function useGetSetting(params: Base) {
  const { data } = useQuery<NotificationSetting>(
    [`/notification/setting`, params],
    {
      enabled: !!params.projectId,
    }
  )

  return { data }
}

export interface UpdateSetting extends Base {
  emails?: NotificationSettingEmails
  browser?: NotificationSettingBrowser
  webhooks?: NotificationSettingWebHook[]
}
export function useUpdateSetting() {
  const queryClient = useQueryClient()
  const mutation = useMutation<NotificationSetting, unknown, UpdateSetting>(
    (data) =>
      request<UpdateSetting, NotificationSetting>(`/notification/setting`, {
        method: 'PATCH',
        data,
      }),
    {
      onSuccess() {
        queryClient.invalidateQueries(`/notification/setting`)
      },
    }
  )

  return {
    mutation,
  }
}

export interface CreateSettingWebhook extends Base {
  type: NotificationSettingWebHookType
  name: string
  link: string
  open?: boolean
  at?: { value: string }[]
}
export function useCreateSettingWebhook() {
  const queryClient = useQueryClient()
  const mutation = useMutation<
    NotificationSettingWebHook,
    unknown,
    CreateSettingWebhook
  >(
    (data) =>
      request<CreateSettingWebhook, NotificationSettingWebHook>(
        `/notification/setting/webhooks`,
        {
          method: 'POST',
          data,
        }
      ),
    {
      onSuccess() {
        queryClient.invalidateQueries(`/notification/setting`)
      },
    }
  )

  return {
    mutation,
  }
}

export interface UpdateSettingWebhook extends Partial<CreateSettingWebhook> {
  id: string
}
export function useUpdateSettingWebhook() {
  const queryClient = useQueryClient()
  const mutation = useMutation<
    NotificationSettingWebHook,
    unknown,
    UpdateSettingWebhook
  >(
    (data) =>
      request<UpdateSettingWebhook, NotificationSettingWebHook>(
        `/notification/setting/webhooks/${data.id}`,
        {
          method: 'PATCH',
          data,
        }
      ),
    {
      onSuccess() {
        queryClient.invalidateQueries(`/notification/setting`)
      },
    }
  )

  return {
    mutation,
  }
}

export interface DeleteSettingWebhook extends Base {
  id: string
}
export function useDeleteSettingWebhook() {
  const queryClient = useQueryClient()
  const mutation = useMutation<
    NotificationSettingWebHook,
    unknown,
    DeleteSettingWebhook
  >(
    (params) =>
      request<UpdateSettingWebhook, NotificationSettingWebHook>(
        `/notification/setting/webhooks/${params.id}`,
        {
          method: 'DELETE',
          // @ts-ignore
          params: {
            projectId: params.projectId,
          },
        }
      ),
    {
      onSuccess() {
        queryClient.invalidateQueries(`/notification/setting`)
      },
    }
  )

  return {
    mutation,
  }
}
