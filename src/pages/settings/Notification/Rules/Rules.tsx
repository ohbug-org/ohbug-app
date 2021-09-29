import { FC, useState } from 'react'
import { Table, Tag, Switch, Button, Modal } from 'antd'
import dayjs from 'dayjs'
import { useAtom } from 'jotai'

import { currentProjectAtom } from '@/atoms'
import type { RouteComponentProps } from '@/ability'
import type { NotificationRule } from '@/types'
import { Zone } from '@/components'
import { useBoolean } from '@/hooks'
import { useDeleteRule, useGetRules, useUpdateRule } from '@/services'

import EditRule from './EditRule'
import { levelList } from './Rules.core'

const Rules: FC<RouteComponentProps> = () => {
  const [currentProject] = useAtom(currentProjectAtom)
  const { data } = useGetRules({ projectId: currentProject?.id })
  const { mutation: updateRuleMutation } = useUpdateRule()
  const { mutation: deleteRuleMutation } = useDeleteRule()
  const [modalVisible, { setTrue: modalShow, setFalse: modalOnCancel }] =
    useBoolean(false)
  const [currentRule, setCurrentRule] = useState<NotificationRule | undefined>(
    undefined
  )
  const [currentSwitch, setCurrentSwitch] = useState<number>()

  return (
    <section>
      <EditRule
        visible={modalVisible}
        onCancel={modalOnCancel}
        initialValues={currentRule}
      />
      <Zone
        title="通知规则"
        extra={
          <Button
            onClick={() => {
              setCurrentRule(undefined)
              modalShow()
            }}
          >
            新建通知规则
          </Button>
        }
      >
        <Table dataSource={data} rowKey="id" pagination={false}>
          <Table.Column<NotificationRule>
            title="名称/规则"
            render={(item: NotificationRule) => (
              <span>
                {item?.name}
                {JSON.stringify(item?.data)}
              </span>
            )}
          />
          <Table.Column<NotificationRule>
            title="通知类型"
            render={(item: NotificationRule) => {
              const { color, label } = levelList.find(
                (v) => v.value === item.level
              )!
              return <Tag color={color}>{label}</Tag>
            }}
          />
          <Table.Column<NotificationRule>
            title="最近通知"
            render={(item: NotificationRule) => (
              <span>
                {item?.recently
                  ? dayjs(item?.recently).format('YYYY-MM-DD HH:mm:ss')
                  : '还没有触发过通知哟~'}
              </span>
            )}
          />
          <Table.Column<NotificationRule>
            title="启用"
            render={(item: NotificationRule) => (
              <Switch
                checked={item?.open}
                loading={
                  updateRuleMutation.isLoading && currentSwitch === item?.id
                }
                onChange={(checked) => {
                  setCurrentSwitch(item?.id)
                  updateRuleMutation.mutate({
                    projectId: currentProject?.id,
                    ruleId: item.id!,
                    open: checked,
                  })
                }}
              />
            )}
          />
          <Table.Column<NotificationRule>
            title="操作"
            render={(item: NotificationRule) => (
              <span>
                <Button
                  className="!text-primary"
                  type="text"
                  size="small"
                  onClick={() => {
                    setCurrentRule(item)
                    modalShow()
                  }}
                >
                  修改
                </Button>
                <Button
                  type="text"
                  danger
                  size="small"
                  onClick={() => {
                    Modal.confirm({
                      title: '请确认是否删除?',
                      content: item?.name,
                      okText: '删除',
                      okType: 'danger',
                      cancelText: '取消',
                      onOk() {
                        deleteRuleMutation.mutate({
                          projectId: currentProject?.id,
                          ruleId: item.id!,
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

export default Rules
