import type { FC, ReactNode } from 'react'
import { Radio } from 'antd'
import { RadioGroupProps } from 'antd/lib/radio'

interface Data {
  label: string
  value: string | number
  icon: ReactNode
}
interface RadioIconButtonProps extends RadioGroupProps {
  dataSource: Data[]
}
const RadioIconButton: FC<RadioIconButtonProps> = ({ dataSource, ...args }) => {
  return (
    <Radio.Group {...args}>
      {dataSource.map((item) => (
        <Radio.Button value={item.value} key={item.value}>
          {item.icon}
          {item.label && <span className="ml-2">{item.label}</span>}
        </Radio.Button>
      ))}
    </Radio.Group>
  )
}

export default RadioIconButton
