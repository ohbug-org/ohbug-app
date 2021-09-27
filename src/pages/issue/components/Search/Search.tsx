import type { FC } from 'react'
import { Space, Tooltip, Select } from 'antd'
import { types } from '@ohbug/core'

import { usePersistFn } from '@/hooks'

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

interface SearchProps {
  handleSearch: (params: {
    page?: number
    start?: string
    end?: string
    type?: string
  }) => void
}

const Search: FC<SearchProps> = ({ handleSearch }) => {
  const handleTypeSelected = usePersistFn((value) => {
    if (value === 'all') {
      handleSearch({
        type: 'all',
      })
    } else {
      handleSearch({
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
        <TimePicker handleSearch={handleSearch} />
      </Tooltip>
    </Space>
  )
}

export default Search
