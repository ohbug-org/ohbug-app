import { Button } from 'antd'
import { store } from '@/ability'

export function activationNotification(email: string) {
  const { dispatch } = store
  dispatch.app.notification({
    message: '用户激活',
    description: (
      <div>
        <span>
          已经将激活邮件发至您的邮箱，未激活账号可能导致部分功能无法使用
        </span>
        <Button
          type="primary"
          onClick={() => {
            dispatch.auth.sendActivationEmail({ email })
          }}
        >
          重新发送激活邮件
        </Button>
      </div>
    ),
    duration: null,
  })
}
