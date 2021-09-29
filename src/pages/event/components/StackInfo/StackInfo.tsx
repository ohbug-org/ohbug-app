import { FC, useState, ReactNode, ReactElement } from 'react'
import { Radio, Collapse } from 'antd'
import clsx from 'clsx'
import type { Result } from 'source-map-trace/dist/interfaces'

import { useCreation, usePersistFn } from '@/hooks'

interface StackInfoProps {
  stack: string
  source?: Result
}

const StackInfo: FC<StackInfoProps> = ({ stack, source }) => {
  const [toggle, setToggle] = useState('raw')
  const handleToggleChange = usePersistFn((e) => {
    setToggle(e.target.value)
  })
  const title = useCreation(
    () => (
      <div>
        <code className="font-semibold mx-1">{source?.parsed?.source}</code>
        <span className="m-0 mx-1 opacity-60">in</span>
        <code className="font-semibold mx-1">{source?.parsed?.name}</code>
        <span className="m-0 mx-1 opacity-60">at line</span>
        <code className="font-semibold mx-1">{source?.parsed?.line}:</code>
        <code className="font-semibold mx-1">{source?.parsed?.column}</code>
      </div>
    ),
    [source]
  )
  const content = useCreation((): ReactNode => {
    switch (toggle) {
      case 'raw':
        return typeof stack === 'string' ? stack : JSON.stringify(stack)
      case 'code':
        return (
          <Collapse
            className="bg-none"
            defaultActiveKey={[1]}
            expandIconPosition="right"
          >
            <Collapse.Panel header={title} key={1}>
              <ol
                className="m-0 py-2 list-inside"
                start={source?.code?.[0].number}
              >
                {source?.code?.map(
                  ({ code, number, highlight }): ReactElement => {
                    const classes = clsx('pl-6 leading-6', {
                      'text-white bg-error': highlight,
                    })
                    return (
                      <li className={classes} key={number}>
                        <span className="pl-6 text-white">{code}</span>
                      </li>
                    )
                  }
                )}
              </ol>
            </Collapse.Panel>
          </Collapse>
        )
      default:
        return null
    }
  }, [source, stack, toggle, title])

  return (
    <div>
      <Radio.Group value={toggle} onChange={handleToggleChange} size="small">
        <Radio.Button value="raw">Raw</Radio.Button>
        <Radio.Button value="code" disabled={!source}>
          Code
        </Radio.Button>
      </Radio.Group>

      <pre className="mt-4 whitespace-pre-wrap break-words">{content}</pre>
    </div>
  )
}

export default StackInfo
