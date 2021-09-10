import { createModel } from '@rematch/core'
import type { RootModel } from '@/models'
import * as api from '@/api'
import { EffectReturn } from '@/ability'

// 通知规则相关的数据 两种方式
// 1. 指标 每段时间
// 2. 区间 最多4个区间
interface NotificationRuleIndicator {
  interval: number // 间隔时间
  percentage: number // 增长百分比
}
type NotificationRuleRange = {
  range1: number
  range2: number
  range3: number
  range4: number
}
export type NotificationRuleData =
  | NotificationRuleIndicator
  | NotificationRuleRange

interface NotificationRuleItem {
  type: string
  message: string
}
export type NotificationRuleWhiteList = NotificationRuleItem[]
export type NotificationRuleBlackList = NotificationRuleItem[]

export type NotificationRuleLevel = 'serious' | 'warning' | 'default'

interface NotificationSettingEmail {
  email: string
  open: boolean
}
export type NotificationSettingEmails = NotificationSettingEmail[]
export type NotificationSettingBrowser = {
  open: boolean
  data: {
    endpoint: string
    keys: {
      p256dh: string
      auth: string
    }
    expirationTime: string | null
  } | null
}
export type NotificationSettingWebHookType =
  | 'dingtalk'
  | 'wechat_work'
  | 'others'
export interface NotificationSettingWebHook {
  id: string
  type: NotificationSettingWebHookType
  name: string
  link: string
  open: boolean
  at?: { value: string }[]
}
export type NotificationSettingWebHooks = NotificationSettingWebHook[]

export interface NotificationRule {
  id?: number
  name?: string
  data?: NotificationRuleData
  whiteList?: NotificationRuleWhiteList
  blackList?: NotificationRuleBlackList
  level?: NotificationRuleLevel
  interval?: number
  open?: boolean
  recently?: Date
  count?: number
}

export interface NotificationSetting {
  id?: number
  emails?: NotificationSettingEmails
  browser?: NotificationSettingBrowser
  webhooks?: NotificationSettingWebHooks
}

export interface NotificationState {
  ruleData?: NotificationRule[]
  settingData?: NotificationSetting
}

export const notification = createModel<RootModel>()({
  state: {
    ruleData: [],
    settingData: undefined,
  } as NotificationState,
  reducers: {
    setState(state, payload: NotificationState) {
      return {
        ...state,
        ...payload,
      }
    },
  },
  effects: (dispatch) => ({
    async createRules(
      {
        name,
        data,
        whiteList,
        blackList,
        level,
        interval,
        open = true,
      }: {
        name: string
        data: string
        whiteList: string
        blackList: string
        level: 'serious' | 'warning' | 'default'
        interval: number
        open: boolean
      },
      state
    ): EffectReturn<NotificationState['ruleData']> {
      const project = state.project.current
      if (project) {
        await api.notification.createRule.call({
          projectId: project.id!,
          name,
          data,
          whiteList,
          blackList,
          level,
          interval,
          open,
        })

        return dispatch.notification.getRules()
      }
      return undefined
    },

    async getRules(_, state): EffectReturn<NotificationState['ruleData']> {
      const project = state.project.current
      if (project) {
        const result = await api.notification.getRules.call({
          projectId: project.id!,
        })

        dispatch.notification.setState({
          ruleData: result,
        })

        return (_state) => _state.notification.ruleData
      }
      return undefined
    },

    async updateRules(
      {
        ruleId,
        name,
        data,
        whiteList,
        blackList,
        level,
        interval,
        open,
      }: {
        ruleId: number
        name?: string
        data?: string
        whiteList?: string
        blackList?: string
        level?: 'serious' | 'warning' | 'default'
        interval?: number
        open?: boolean
      },
      state
    ): EffectReturn<NotificationState['ruleData']> {
      const project = state.project.current
      if (ruleId && project) {
        await api.notification.updateRule.call({
          projectId: project.id!,
          ruleId,
          name,
          data,
          whiteList,
          blackList,
          level,
          interval,
          open,
        })

        return dispatch.notification.getRules()
      }
      return undefined
    },

    async deleteRule(
      { ruleId }: { ruleId: number },
      state
    ): EffectReturn<NotificationState['ruleData']> {
      const project = state.project.current
      if (ruleId && project) {
        await api.notification.deleteRule.call({
          projectId: project.id!,
          ruleId,
        })

        return dispatch.notification.getRules()
      }
      return undefined
    },

    async getSetting(_, state): EffectReturn<NotificationState['settingData']> {
      const project = state.project.current
      if (project) {
        const result = await api.notification.getSetting.call({
          projectId: project.id!,
        })

        dispatch.notification.setState({
          settingData: result,
        })

        return (_state) => _state.notification.settingData
      }
      return undefined
    },

    async updateSetting(
      {
        emails,
        browser,
        webhooks,
      }: {
        emails?: NotificationSettingEmails
        browser?: NotificationSettingBrowser
        webhooks?: NotificationSettingWebHook[]
      },
      state
    ): EffectReturn<NotificationState['settingData']> {
      const project = state.project.current
      if (project) {
        await api.notification.updateSetting.call({
          projectId: project.id!,
          emails,
          browser,
          webhooks,
        })

        return dispatch.notification.getSetting()
      }
      return undefined
    },

    async createWebhooksSetting(
      {
        type,
        name,
        link,
        open,
        at,
      }: {
        type: NotificationSettingWebHookType
        name: string
        link: string
        open?: boolean
        at?: { value: string }[]
      },
      state
    ): EffectReturn<NotificationState['settingData']> {
      const project = state.project.current
      if (project) {
        await api.notification.createSettingWebhook.call({
          projectId: project.id!,
          type,
          name,
          link,
          open,
          at,
        })

        return dispatch.notification.getSetting()
      }
      return undefined
    },

    async updateWebhooksSetting(
      {
        id,
        type,
        name,
        link,
        open,
        at,
      }: {
        id: string
        type?: NotificationSettingWebHookType
        name?: string
        link?: string
        open?: boolean
        at?: { value: string }[]
      },
      state
    ): EffectReturn<NotificationState['settingData']> {
      const project = state.project.current
      if (id && project) {
        await api.notification.updateSettingWebhook.call({
          projectId: project.id,
          id,
          type,
          name,
          link,
          open,
          at,
        })

        return dispatch.notification.getSetting()
      }
      return undefined
    },

    async deleteWebhooksSetting(
      { id }: { id: string },
      state
    ): EffectReturn<NotificationState['settingData']> {
      const project = state.project.current
      if (id && project) {
        await api.notification.deleteSettingWebhook.call({
          projectId: project.id!,
          id,
        })

        return dispatch.notification.getSetting()
      }
      return undefined
    },
  }),
})
