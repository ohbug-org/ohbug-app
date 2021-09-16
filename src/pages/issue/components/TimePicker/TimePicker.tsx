import type { FC } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { Tooltip } from 'antd'

import { useModelEffect, useModelState } from '@/ability'
import { DatePicker } from '@/components'
import { usePersistFn } from '@/hooks'

const TimePicker: FC = () => {
  const { data, run: searchIssues } = useModelEffect(
    (dispatch) => dispatch.issue.searchIssues,
    { manual: true }
  )
  const project = useModelState((state) => state.project.current)

  const handleTimeChange = usePersistFn(
    (dates: [start: Dayjs | null, end: Dayjs | null] | null) => {
      if (project && dates) {
        const [start, end] = dates
        searchIssues({
          projectId: project.id,
          page: 0,
          start: start?.toISOString() as unknown as Date,
          end: end?.toISOString() as unknown as Date,
        })
      }
    }
  )

  return (
    <Tooltip title="根据 Issue 创建时间筛选">
      <DatePicker.RangePicker
        defaultValue={[dayjs().subtract(13, 'day'), dayjs()]}
        ranges={data?.ranges}
        onChange={handleTimeChange}
      />
    </Tooltip>
  )
}

export default TimePicker
