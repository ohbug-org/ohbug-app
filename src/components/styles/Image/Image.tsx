import type { FC, CSSProperties, MouseEvent as IMouseEvent } from 'react'
import clsx from 'clsx'

interface ImageProps {
  src: string
  alt: string
  className?: string
  style?: CSSProperties
  onClick?: (event: IMouseEvent<HTMLDivElement, MouseEvent>) => void
  center?: boolean
}
const Image: FC<ImageProps> = ({
  src,
  alt,
  className,
  style,
  center,
  ...args
}) => {
  const classes = clsx(className, {
    'flex items-center justify-center': center,
  })
  return (
    <div className={classes} style={style} role="img" {...args}>
      <img className="block w-full" src={src} alt={alt} />
    </div>
  )
}

export default Image
