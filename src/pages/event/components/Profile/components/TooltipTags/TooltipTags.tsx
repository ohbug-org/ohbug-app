import type { FC, ReactChild, ReactNode } from 'react'
import { Tag, Tooltip } from 'antd'

interface TooltipTagsProps {
  title: ReactChild
  value: any
  icon: ReactNode
}
const TooltipTags: FC<TooltipTagsProps> = ({ title, value, icon }) => (
  <Tooltip title={title}>
    <Tag
      className="max-w-xs overflow-hidden truncate cursor-pointer"
      icon={icon}
      color="default"
    >
      {value}
    </Tag>
  </Tooltip>
)

export default TooltipTags
