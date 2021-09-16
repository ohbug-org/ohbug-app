import type { FC } from 'react'
import { Button, Modal, Table } from 'antd'
import dayjs from 'dayjs'

import {
  RouteComponentProps,
  useModelDispatch,
  useModelEffect,
  useModelState,
} from '@/ability'
import type { SourceMap } from '@/types'
import { Zone } from '@/components'

import styles from './SourceMap.module.less'

const SourceMapCompnent: FC<RouteComponentProps> = () => {
  const currentProject = useModelState((state) => state.project.current)
  const { data, loading } = useModelEffect(
    (dispatch) => dispatch.sourceMap.get,
    {
      refreshDeps: [currentProject],
    }
  )
  const deleteSourceMap = useModelDispatch(
    (dispatch) => dispatch.sourceMap.delete
  )

  return (
    <section className={styles.root}>
      <Zone title="SourceMap">
        <Table<SourceMap>
          dataSource={data}
          loading={loading}
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
                        deleteSourceMap({
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
