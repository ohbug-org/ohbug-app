import { FC, useState, Suspense } from 'react'
import clsx from 'clsx'
import { Row, Col, Card, Avatar, Spin } from 'antd'

import type { RouteComponentProps } from '@/ability'
import { Layout } from '@/components'
import { usePersistFn } from '@/hooks'
import { useGetExtensions } from '@/services'

import ExtensionDetail from './components/ExtensionDetail'

const Market: FC<RouteComponentProps> = () => {
  const [currentId, setCurrentId] = useState<number>()
  const { data } = useGetExtensions()

  const handleSelectExtension = usePersistFn((id: number) => {
    setCurrentId(id)
  })

  return (
    <Layout>
      <Row gutter={24}>
        <Col span={6}>
          {data?.[0]?.map((v) => (
            <Card
              className={clsx(
                'mb-3 !border-0 !border-b-4 !border-solid border-transparent hover:!border-primary',
                {
                  '!border-primary': v.id === currentId,
                }
              )}
              onClick={() => handleSelectExtension(v.id!)}
              hoverable
              key={v.key}
            >
              <Card.Meta
                avatar={<Avatar src={v.logo ?? '/logo.svg'} />}
                title={v.name}
                description={v.description}
              />
            </Card>
          ))}
        </Col>
        <Col className="flex-1" span={18}>
          <Suspense fallback={<Spin />}>
            <ExtensionDetail id={currentId} />
          </Suspense>
        </Col>
      </Row>
    </Layout>
  )
}

export default Market
