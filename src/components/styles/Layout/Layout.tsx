import type { FC } from 'react'
import { Layout } from 'antd'
import clsx from 'clsx'

import { useBoolean, usePersistFn, useMount } from '@/hooks'

import styles from './Layout.module.less'

const { Content } = Layout

interface BasicLayoutProps {
  className?: string
}

const BasicLayout: FC<BasicLayoutProps> = ({ children, className }) => {
  const classes = clsx(styles.content, className)
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
    <Layout className={styles.root}>
      <Content className={classes}>{children}</Content>
    </Layout>
  )
}

export default BasicLayout
