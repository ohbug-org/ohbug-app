import type { FC } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { Tooltip } from 'antd'

import { DatePicker } from '@/components'
import { usePersistFn } from '@/hooks'

interface TimePickerProps {
  handleSearch: (params: {
    page?: number
    start?: string
    end?: string
    type?: string
  }) => void
}

const today: [Dayjs, Dayjs] = [dayjs().subtract(23, 'hour'), dayjs()]
const twoWeeks: [Dayjs, Dayjs] = [
  dayjs().subtract(13, 'day').startOf('day'),
  dayjs().startOf('day'),
]

const TimePicker: FC<TimePickerProps> = ({ handleSearch }) => {
  const handleTimeChange = usePersistFn(
    (dates: [start: Dayjs | null, end: Dayjs | null] | null) => {
      if (dates) {
        const [start, end] = dates
        handleSearch({
          page: 0,
          start: start?.toISOString(),
          end: end?.toISOString(),
        })
      }
    }
  )

  return (
    <Tooltip title="根据 Issue 创建时间筛选">
      <DatePicker.RangePicker
        defaultValue={twoWeeks}
        ranges={{
          // @ts-ignore
          当日: today,
          // @ts-ignore
          近两周: twoWeeks,
        }}
        onChange={handleTimeChange}
      />
    </Tooltip>
  )
}

export default TimePicker
