import type { FC, ReactNode } from 'react'
import clsx from 'clsx'

import styles from './Zone.module.less'

interface ZoneProps {
  className?: string
  title?: ReactNode
  extra?: ReactNode
  children?: ReactNode
  type?: 'normal' | 'danger'
}
const Zone: FC<ZoneProps> = ({
  className,
  title,
  extra,
  children,
  type = 'normal',
}) => {
  const classes = clsx(className, styles.root)
  const titleClasses = clsx(styles.title, {
    [styles.danger]: type === 'danger',
  })
  const containerClasses = clsx(styles.container, {
    [styles.danger]: type === 'danger',
  })
  return (
    <section className={classes}>
      <h2 className={titleClasses}>
        {title}
        {extra}
      </h2>
      <div className={containerClasses}>{children}</div>
    </section>
  )
}

export default Zone
