import type { FC, ReactNode } from 'react'
import clsx from 'clsx'

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
  const titleClasses = clsx(
    'font-normal text-2xl flex items-center justify-between',
    {
      'm-0 font-semibold border-b-0 text-red-500': type === 'danger',
    }
  )
  const containerClasses = clsx('rounded-md', {
    'border-2 border-solid border-red-500': type === 'danger',
  })
  return (
    <section className={clsx(className, 'mb-6')}>
      <h2 className={titleClasses}>
        {title}
        {extra}
      </h2>
      <div className={containerClasses}>{children}</div>
    </section>
  )
}

export default Zone
