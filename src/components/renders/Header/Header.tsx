import type { FC } from 'react'
import { Button, Space, Tooltip } from 'antd'
import { ReadOutlined, SettingOutlined } from '@ant-design/icons'
import clsx from 'clsx'

import { routes, Route } from '@/config'
import { useCreation } from '@/hooks'
import { Link, navigate } from '@/ability'

import ProjectSelector from './ProjectSelector'

import styles from './Header.module.less'

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
    <div className={styles.root}>
      <div className={styles.switch}>
        <ProjectSelector />
      </div>

      <div className={styles.menu}>
        {menuItemData.map((item) => (
          <Link
            className={styles.item}
            key={item.redirect || item.path}
            to={item.path}
            getProps={({ isPartiallyCurrent }) => ({
              className: clsx(
                'inline-block h-full text-white text-opacity-60 px-4 border-t-2 border-transparent transition-all hover:text-opacity-100 hover:border-t-2 hover:border-primary',
                {
                  'text-opacity-100 border-t-2 border-primary text-primary':
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
            type="link"
            icon={<ReadOutlined />}
            href="https://ohbug.net/docs"
            target="_blank"
          />
        </Tooltip>
      </Space>
    </div>
  )
}

export default Header
