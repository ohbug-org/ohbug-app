import type { FC } from 'react'
import { Button, Modal, Table } from 'antd'
import dayjs from 'dayjs'
import { useAtom } from 'jotai'

import { currentProjectAtom } from '@/atoms'
import type { RouteComponentProps } from '@/ability'
import type { SourceMap } from '@/types'
import { Zone } from '@/components'

import styles from './SourceMap.module.less'
import { useDeleteSourceMap, useGetSourceMaps } from '@/services'

const SourceMapCompnent: FC<RouteComponentProps> = () => {
  const [currentProject] = useAtom(currentProjectAtom)
  const { data } = useGetSourceMaps(currentProject?.apiKey)
  const { mutation } = useDeleteSourceMap()

  return (
    <section className={styles.root}>
      <Zone title="SourceMap">
        <Table<SourceMap>
          dataSource={data}
          rowKey={(record) => record.id!}
          pagination={false}
        >
          <Table.Column<SourceMap>
            title="文件名"
            render={(item) => (
              <span>
                {item?.data
                  ?.map(({ originalname }: any) => originalname)
                  .join(',')}
              </span>
            )}
          />
          <Table.Column<SourceMap>
            title="appVersion"
            render={(item) => <span>{item?.appVersion}</span>}
          />
          <Table.Column<SourceMap>
            title="appType"
            render={(item) => <span>{item?.appType}</span>}
          />
          <Table.Column<SourceMap>
            title="上传时间"
            render={(item) => (
              <span>
                {dayjs(item?.createdAt).format('YYYY-MM-DD HH:mm:ss')}
              </span>
            )}
          />
          <Table.Column<SourceMap>
            title="操作"
            render={(item) => (
              <span>
                <Button
                  className={styles.deleteButton}
                  type="text"
                  size="small"
                  onClick={() => {
                    Modal.confirm({
                      title: '请确认是否删除?',
                      okText: '删除',
                      okType: 'danger',
                      cancelText: '取消',
                      onOk() {
                        mutation.mutate({
                          apiKey: currentProject?.apiKey,
                          sourceMapId: item?.id,
                        })
                      },
                    })
                  }}
                >
                  删除
                </Button>
              </span>
            )}
          />
        </Table>
      </Zone>
    </section>
  )
}

export default SourceMapCompnent
