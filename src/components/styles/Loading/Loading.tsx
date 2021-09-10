import type { FC } from 'react'
import { Spin } from 'antd'

import styles from './Loading.module.less'

const Loading: FC = () => (
  <div className={styles.root}>
    <Spin />
  </div>
)

export default Loading
