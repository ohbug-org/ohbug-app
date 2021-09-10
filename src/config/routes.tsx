import { FC, ReactNode, lazy } from 'react'
import {
  DashboardOutlined,
  IssuesCloseOutlined,
  ShopOutlined,
} from '@ant-design/icons'

import type { RouteComponentProps } from '@/ability'
import Auth from '@/components/renders/Auth'

export interface Route {
  path: string
  wrapper?: FC
  redirect?: string
  component?: FC<RouteComponentProps>
  menu?: {
    name: string
    icon: ReactNode
  }
  layout?: {
    hideNav?: boolean
  }
  routes?: Route[]
  default?: boolean
}
const GettingStarted = lazy<FC<RouteComponentProps>>(
  () => import('../pages/getting-started')
)
const CreateProject = lazy<FC<RouteComponentProps>>(
  () => import('../pages/create-project')
)
const Overview = lazy<FC<RouteComponentProps>>(
  () => import('../pages/overview')
)
const Issue = lazy<FC<RouteComponentProps>>(() => import('../pages/issue'))
const Event = lazy<FC<RouteComponentProps>>(() => import('../pages/event'))
const Market = lazy<FC<RouteComponentProps>>(() => import('../pages/market'))
const Settings = lazy<FC<RouteComponentProps>>(
  () => import('../pages/settings')
)
const Profile = lazy<FC<RouteComponentProps>>(
  () => import('../pages/settings/Profile')
)
const NotificationRules = lazy<FC<RouteComponentProps>>(
  () => import('../pages/settings/Notification/Rules')
)
const NotificationSetting = lazy<FC<RouteComponentProps>>(
  () => import('../pages/settings/Notification/Setting')
)
const SourceMap = lazy<FC<RouteComponentProps>>(
  () => import('../pages/settings/SourceMap')
)
const NotFound = lazy<FC<RouteComponentProps>>(
  () => import('../pages/not-found')
)
const NotAuthorized = lazy<FC<RouteComponentProps>>(
  () => import('../pages/not-authorized')
)

export const routes: Route[] = [
  {
    path: '/',
    wrapper: Auth,
    redirect: '/issue',
  },
  {
    path: '/getting-started',
    component: GettingStarted,
  },
  {
    path: '/create-project',
    component: CreateProject,
  },
  {
    path: '/overview',
    component: Overview,
    wrapper: Auth,
    // layout
    menu: {
      name: '总览',
      icon: <DashboardOutlined />,
    },
  },
  {
    path: '/issue',
    component: Issue,
    wrapper: Auth,
    // layout
    menu: {
      name: '问题',
      icon: <IssuesCloseOutlined />,
    },
  },
  {
    path: '/issue/:issueId/event/:eventId',
    component: Event,
    wrapper: Auth,
  },
  {
    path: '/market',
    component: Market,
    wrapper: Auth,
    // layout
    menu: {
      name: '插件市场',
      icon: <ShopOutlined />,
    },
  },
  {
    path: '/settings',
    component: Settings,
    wrapper: Auth,
    redirect: '/settings/profile',
    routes: [
      {
        path: 'profile',
        component: Profile,
      },
      {
        path: 'notification_rules',
        component: NotificationRules,
      },
      {
        path: 'notification_setting',
        component: NotificationSetting,
      },
      {
        path: 'sourcemap',
        component: SourceMap,
      },
    ],
  },
  {
    default: true,
    path: '/404',
    component: NotFound,
    layout: {
      hideNav: true,
    },
  },
  {
    path: '/403',
    component: NotAuthorized,
    layout: {
      hideNav: true,
    },
  },
]
