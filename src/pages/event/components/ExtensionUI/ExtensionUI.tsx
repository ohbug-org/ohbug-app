import { FC, useRef } from 'react'
import { useAtom } from 'jotai'
import type { OhbugEvent } from '@ohbug/types'

import { currentProjectAtom } from '@/atoms'
import { useCreation, useMount } from '@/hooks'

import frameURL from './frame.html?url'

interface ExtensionUIProps {
  data: any
  extensionKey: string
  event: OhbugEvent<any>
}

const ExtensionUI: FC<ExtensionUIProps> = ({ extensionKey, data, event }) => {
  const [currentProject] = useAtom(currentProjectAtom)
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
      className="w-full"
      style={{ minHeight: '55vh' }}
      ref={ref}
      title="ohbug-event-iframe"
      src={frameURL}
      frameBorder="0"
    />
  )
}

export default ExtensionUI
