import { FC, Suspense } from 'react'
import { Card, Menu, Spin } from 'antd'

import { RouteComponentProps, useLocation, navigate } from '@/ability'
import { Layout } from '@/components'
import { useCreation } from '@/hooks'

interface MenuItem {
  label: string
  key: string
  path?: string
  children?: MenuList
}
type MenuList = MenuItem[]
const menuList: MenuList = [
  {
    label: 'Profile',
    key: `profile`,
    path: `/settings/profile`,
  },
  {
    label: '通知',
    key: `notification`,
    children: [
      {
        label: '通知规则',
        key: `notification_rules`,
        path: `/settings/notification_rules`,
      },
      {
        label: '通知设置',
        key: `notification_setting`,
        path: `/settings/notification_setting`,
      },
    ],
  },
  {
    label: 'SourceMap',
    key: `sourcemap`,
    path: `/settings/sourcemap`,
  },
]
function renderMenu(data: MenuList, handleItemClick: (item: MenuItem) => void) {
  return data.map((item) =>
    Array.isArray(item.children) ? (
      <Menu.SubMenu key={item.key} title={item.label}>
        {renderMenu(item.children, handleItemClick)}
      </Menu.SubMenu>
    ) : (
      <Menu.Item key={item.key} onClick={() => handleItemClick(item)}>
        {item.label}
      </Menu.Item>
    )
  )
}

const Settings: FC<RouteComponentProps> = ({ children }) => {
  const location = useLocation()
  const selectedKeys = useCreation(() => {
    const [, key] = location.pathname.split(`/settings/`)
    return [key]
  }, [location])

  return (
    <Layout>
      <Card>
        <div className="flex justify-between pt-6">
          <Menu
            style={{ width: 220 }}
            selectedKeys={selectedKeys}
            defaultOpenKeys={['notification']}
            mode="inline"
          >
            {renderMenu(menuList, (item) => {
              navigate(item.path!, { replace: true })
            })}
          </Menu>
          <section className="flex-1 px-12">
            <Suspense fallback={<Spin />}>{children}</Suspense>
          </section>
        </div>
      </Card>
    </Layout>
  )
}

export default Settings
