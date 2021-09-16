import { createApi } from '@/ability'
import type {
  NotificationRule,
  NotificationSettingWebHook,
  NotificationSettingBrowser,
  NotificationSettingEmails,
  NotificationSettingWebHookType,
  NotificationSetting,
} from '@/types'

type Level = 'serious' | 'warning' | 'default'
interface Base {
  projectId: number
}
interface CreateRule extends Base {
  name: string
  data: string
  whiteList: string
  blackList: string
  level: Level
  interval: number
  open: boolean
}
interface UpdateRule extends Base {
  ruleId: number
  name?: string
  data?: string
  whiteList?: string
  blackList?: string
  level?: Level
  interval?: number
  open?: boolean
}
interface DeleteRule extends Base {
  ruleId: number
}

interface UpdateSetting extends Base {
  emails?: NotificationSettingEmails
  browser?: NotificationSettingBrowser
  webhooks?: NotificationSettingWebHook[]
}
interface CreateSettingWebhook extends Base {
  type: NotificationSettingWebHookType
  name: string
  link: string
  open?: boolean
  at?: { value: string }[]
}
interface UpdateSettingWebhook extends Partial<CreateSettingWebhook> {
  id: string
}
interface DeleteSettingWebhook extends Base {
  id: string
}

export const notification = {
  createRule: createApi<CreateRule, NotificationRule>({
    url: '/notification/rules',
    method: 'post',
  }),
  getRules: createApi<Base, NotificationRule[]>({
    url: '/notification/rules',
    method: 'get',
  }),
  updateRule: createApi<UpdateRule, NotificationRule>({
    url: ({ ruleId }) => `/notification/rules/${ruleId}`,
    method: 'patch',
    data: ({
      projectId,
      name,
      data,
      whiteList,
      blackList,
      level,
      interval,
      open,
    }) => ({
      projectId,
      name,
      data,
      whiteList,
      blackList,
      level,
      interval,
      open,
    }),
  }),
  deleteRule: createApi<DeleteRule, NotificationRule>({
    url: ({ ruleId }) => `/notification/rules/${ruleId}`,
    method: 'delete',
    params: ({ projectId }) => ({ projectId }),
  }),
  getSetting: createApi<Base, NotificationSetting>({
    url: '/notification/setting',
    method: 'get',
  }),
  updateSetting: createApi<UpdateSetting, NotificationSetting>({
    url: '/notification/setting',
    method: 'patch',
    data: ({ projectId, emails, browser, webhooks }) => ({
      projectId,
      emails,
      browser,
      webhooks,
    }),
  }),
  createSettingWebhook: createApi<
    CreateSettingWebhook,
    NotificationSettingWebHook
  >({
    url: `/notification/setting/webhooks`,
    method: 'post',
    data: ({ projectId, type, name, link, open, at }) => ({
      projectId,
      type,
      name,
      link,
      open,
      at,
    }),
  }),
  updateSettingWebhook: createApi<
    UpdateSettingWebhook,
    NotificationSettingWebHook
  >({
    url: ({ id }) => `/notification/setting/webhooks/${id}`,
    method: 'patch',
    data: ({ projectId, type, name, link, open, at }) => ({
      projectId,
      type,
      name,
      link,
      open,
      at,
    }),
  }),
  deleteSettingWebhook: createApi<DeleteSettingWebhook, boolean>({
    url: ({ id }) => `/notification/setting/webhooks/${id}`,
    method: 'delete',
    params: ({ projectId }) => ({ projectId }),
  }),
}
