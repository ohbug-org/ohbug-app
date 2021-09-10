import { FC, useState, ReactNode, ReactElement } from 'react'
import { Radio, Collapse } from 'antd'
import clsx from 'clsx'
import type { Result } from 'source-map-trace/dist/interfaces'

import { useCreation, usePersistFn } from '@/hooks'

import styles from './StackInfo.module.less'

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
      <div className={styles.title}>
        <code className={styles.strong}>{source?.parsed?.source}</code>
        <span>in</span>
        <code className={styles.strong}>{source?.parsed?.name}</code>
        <span>at line</span>
        <code className={styles.strong}>{source?.parsed?.line}:</code>
        <code className={styles.strong}>{source?.parsed?.column}</code>
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
            className={styles.collapse}
            defaultActiveKey={[1]}
            expandIconPosition="right"
            bordered={false}
          >
            <Collapse.Panel className={styles.panel} header={title} key={1}>
              <ol className={styles.codes} start={source?.code?.[0].number}>
                {source?.code?.map(
                  ({ code, number, highlight }): ReactElement => {
                    const classes = clsx(styles.line, {
                      [styles.highlight]: highlight,
                    })
                    return (
                      <li className={classes} key={number}>
                        <span className={styles.code}>{code}</span>
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
    <div className={styles.root}>
      <Radio.Group
        className={styles.toggle}
        value={toggle}
        onChange={handleToggleChange}
        size="small"
      >
        <Radio.Button value="raw">Raw</Radio.Button>
        <Radio.Button value="code" disabled={!source}>
          Code
        </Radio.Button>
      </Radio.Group>

      <pre className={styles.playground}>{content}</pre>
    </div>
  )
}

export default StackInfo
