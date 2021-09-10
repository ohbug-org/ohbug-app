import type { ReactNode } from 'react'
import { Empty, Button } from 'antd'

import { useLocation } from '@/ability'

import styles from './renderEmpty.module.less'

const renderEmpty = (componentName?: string) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const location = useLocation()

  let description: ReactNode
  let children: ReactNode
  if (componentName === 'List' && location.pathname === '/issue') {
    // issue
    description = <span>Ohbug 正等待接收您的第一个事件。</span>
    children = (
      <div>
        <Button type="link" size="large" href="/getting-started">
          安装说明
        </Button>
      </div>
    )
  }

  return (
    <Empty
      className={styles.root}
      image={Empty.PRESENTED_IMAGE_DEFAULT}
      description={description}
    >
      {children}
    </Empty>
  )
}

export default renderEmpty
