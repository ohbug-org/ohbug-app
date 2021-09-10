import { message, notification } from 'antd'
import { ArgsProps } from 'antd/es/notification'
import { createModel } from '@rematch/core'

import type { RootModel } from '@/models'

export const app = createModel<RootModel>()({
  state: null,
  effects: {
    error(payload: string) {
      message.error(payload, 5)
    },
    info(payload: string) {
      message.info(payload)
    },
    notification(config: ArgsProps) {
      notification.warn(config)
    },
  },
})
