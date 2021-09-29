import type { FC } from 'react'
import { Layout, Button, Space, Tooltip } from 'antd'
import { ReadOutlined, SettingOutlined } from '@ant-design/icons'
import clsx from 'clsx'

import { routes, Route } from '@/config'
import { useCreation } from '@/hooks'
import { Link, navigate } from '@/ability'

import ProjectSelector from './ProjectSelector'

function generateMenuItemData(data: Route[]): Route[] {
  return data
    .map((route) => {
      if (route.menu) {
        return route
      }
      return null
    })
    .filter((v) => !!v) as Route[]
}

const Header: FC = () => {
  const menuItemData = useCreation(() => generateMenuItemData(routes), [])

  return (
    <Layout.Header className="w-full fixed top-0 z-50 shadow-xl backdrop-filter backdrop-blur !bg-gray-900 !bg-opacity-60 flex items-center justify-between overflow-hidden">
      <ProjectSelector />

      <div className="px-6 relative">
        {menuItemData.map((item) => (
          <Link
            key={item.redirect || item.path}
            to={item.path}
            getProps={({ isPartiallyCurrent }) => ({
              className: clsx(
                'inline-block h-full text-white text-opacity-60 px-4 border-t-4 border-transparent transition-all hover:text-white hover:border-t-4 hover:border-primary',
                {
                  'text-opacity-100 border-t-4 border-primary':
                    isPartiallyCurrent,
                }
              ),
            })}
          >
            {item.menu!.icon}
            <span className="ml-2">{item.menu?.name}</span>
          </Link>
        ))}
      </div>

      <Space>
        <Tooltip title="项目设置" placement="bottom">
          <Button
            type="text"
            icon={<SettingOutlined />}
            onClick={() => navigate('/settings')}
          />
        </Tooltip>
        <Tooltip title="文档" placement="bottom">
          <Button
            className="!text-white"
            type="link"
            icon={<ReadOutlined />}
            href="https://ohbug.net/docs"
            target="_blank"
          />
        </Tooltip>
      </Space>
    </Layout.Header>
  )
}

export default Header
