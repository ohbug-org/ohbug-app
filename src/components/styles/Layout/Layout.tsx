import type { FC, CSSProperties } from 'react'
import { Layout } from 'antd'
import clsx from 'clsx'

import { useBoolean, usePersistFn, useMount } from '@/hooks'

const { Content } = Layout

interface BasicLayoutProps {
  className?: string
  style?: CSSProperties
}

const BasicLayout: FC<BasicLayoutProps> = ({ children, className, style }) => {
  const [isTop, { toggle: toggleIsTop }] = useBoolean(true)

  const handleScroll = usePersistFn(() => {
    const scrollTop = window.scrollY
    if (scrollTop > 0) {
      if (isTop) toggleIsTop(false)
    } else {
      toggleIsTop(true)
    }
  })

  useMount(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  })

  return (
    <Layout
      className="relative"
      style={{ ...style, minHeight: `calc(100vh - 100px)` }}
    >
      <Content className={clsx(className, 'p-6')}>{children}</Content>
    </Layout>
  )
}

export default BasicLayout
