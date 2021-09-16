import type { FC } from 'react'
import { Space, Tooltip, Select } from 'antd'
import { types } from '@ohbug/core'

import { usePersistFn } from 'ahooks'
import { useModelEffect } from '@/ability'

import TimePicker from '../TimePicker'

import styles from './Search.module.less'

const TYPE = [
  { label: 'ALL', value: 'all' },
  ...Object.keys(types).map((key) => ({
    // @ts-ignore
    value: types[key],
    label: key,
  })),
]

const Search: FC = () => {
  const { run: searchIssues } = useModelEffect(
    (dispatch) => dispatch.issue.searchIssues,
    { manual: true }
  )
  const handleTypeSelected = usePersistFn((value) => {
    if (value === 'all') {
      searchIssues({})
    } else {
      searchIssues({
        type: value,
      })
    }
  })

  return (
    <Space className={styles.root} size="middle">
      <Space>
        <Tooltip title="根据 Issue 类型筛选">
          <Select
            defaultValue="all"
            dropdownMatchSelectWidth={false}
            options={TYPE}
            onSelect={handleTypeSelected}
          />
        </Tooltip>
      </Space>

      <Tooltip title="根据 Issue 创建时间筛选">
        <TimePicker />
      </Tooltip>
    </Space>
  )
}

export default Search
