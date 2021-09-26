import { FC, useRef } from 'react'
import { useRecoilValue } from 'recoil'
import type { OhbugEvent } from '@ohbug/types'

import { currentProjectState } from '@/states'
import { useCreation, useMount } from '@/hooks'

import frameURL from './frame.html?url'

import styles from './ExtensionUI.module.less'

interface ExtensionUIProps {
  data: any
  extensionKey: string
  event: OhbugEvent<any>
}

const ExtensionUI: FC<ExtensionUIProps> = ({ extensionKey, data, event }) => {
  const currentProject = useRecoilValue(currentProjectState)
  const extension = useCreation(
    () =>
      (currentProject?.extensions || []).find((v) => v.key === extensionKey),
    [extensionKey, currentProject]
  )
  const ref = useRef<HTMLIFrameElement>(null)

  useMount(() => {
    const window = ref.current?.contentWindow
    if (window) {
      window.onload = () => {
        window.postMessage?.({ event, data, extension }, '*')
      }
    }
  })

  return (
    <iframe
      className={styles.frame}
      ref={ref}
      title="ohbug-event-iframe"
      src={frameURL}
      frameBorder="0"
    />
  )
}

export default ExtensionUI
