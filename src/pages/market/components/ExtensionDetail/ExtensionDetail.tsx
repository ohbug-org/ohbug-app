import type { FC } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Card, Avatar, Switch, Typography } from 'antd'
import MarkdownIt from 'markdown-it'
import { GithubOutlined } from '@ant-design/icons'
import type { Language } from 'prism-react-renderer'
import { useAtom } from 'jotai'

import { currentProjectAtom } from '@/atoms'
import { useCreation, usePersistFn } from '@/hooks'
import { Highlight } from '@/components'
import { useGetExtension, useSwitchExtension } from '@/services'

interface ExtensionDetailProps {
  id?: number
}

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight(code, language) {
    return renderToStaticMarkup(
      <Highlight code={code} language={language as Language} />
    )
  },
})

const ExtensionDetailComponent: FC<ExtensionDetailProps> = ({ id }) => {
  const { data: extension } = useGetExtension(id)

  const html = useCreation(
    () => extension && md.render(extension?.readme),
    [extension]
  )
  const [currentProject] = useAtom(currentProjectAtom)
  const enabled = useCreation(
    () => !!currentProject?.extensions?.find((v) => v.id === extension?.id),
    [currentProject, extension]
  )

  const { mutation } = useSwitchExtension()

  const handleSwitch = usePersistFn((checked) => {
    if (currentProject?.id && extension) {
      mutation.mutate({
        projectId: currentProject.id,
        extensionId: extension?.id!,
        enabled: checked,
      })
    }
  })

  return (
    <Card>
      {extension ? (
        <>
          <div className="flex items-center justify-between mb-12">
            <div>
              <a
                className="flex items-center"
                href={extension?.repository.url}
                target="_blank"
                rel="noreferrer"
              >
                <GithubOutlined className="w-8 mr-2" />
                <span>{extension?.repository.url}</span>
              </a>
              <div className="flex items-center">
                <div className="w-8 mr-2">
                  <Avatar src={extension?.logo} />
                </div>
                {extension?.author}
              </div>
            </div>
            <div>
              <Switch
                onChange={handleSwitch}
                loading={mutation.isLoading}
                checked={enabled}
              />
            </div>
          </div>

          {html && (
            <div
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )}
        </>
      ) : (
        <Typography>
          <Typography.Title>Extend Ohbug</Typography.Title>
          <Typography.Text type="secondary">
            Find tools to improve your workflow
          </Typography.Text>
        </Typography>
      )}
    </Card>
  )
}

export default ExtensionDetailComponent
