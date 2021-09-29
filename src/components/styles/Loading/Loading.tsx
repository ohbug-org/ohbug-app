import type { FC } from 'react'
import { Spin } from 'antd'

const Loading: FC = () => (
  <div className="w-screen h-screen flex items-center justify-center">
    <Spin />
  </div>
)

export default Loading
