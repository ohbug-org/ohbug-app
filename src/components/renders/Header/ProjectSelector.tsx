import type { FC } from 'react'
import { Menu, Drawer, Image, Button, Divider } from 'antd'
import { MenuOutlined, PlusOutlined } from '@ant-design/icons'
import { useAtom } from 'jotai'

import { currentProjectAtom, projectsAtom } from '@/atoms'
import { navigate } from '@/ability'
import { usePersistFn, useBoolean } from '@/hooks'

const ProjectSelector: FC = () => {
  const [projects] = useAtom(projectsAtom)
  const [project, setProject] = useAtom(currentProjectAtom)
  const [visible, { toggle }] = useBoolean(false)

  const handleProjectChange = usePersistFn(({ key: projectId }) => {
    if (projectId !== 'create') {
      const target = projects?.find((v) => v.id === parseInt(projectId, 10))
      if (target) {
        setProject(target)
        toggle(false)
      }
    }
  })
  const handleNavigateToCreateProject = usePersistFn(() => {
    navigate('/create-project')
  })

  return (
    <>
      <div
        className="cursor-pointer"
        role="button"
        tabIndex={0}
        onClick={() => toggle(true)}
      >
        <MenuOutlined />
        <span className="ml-2 uppercase font-semibold">{project?.name}</span>
      </div>
      <Drawer
        placement="left"
        title={
          <Button type="link" href="https://ohbug.net" target="_blank">
            <Image src="/logo.svg" width={86} preview={false} />
          </Button>
        }
        onClose={() => toggle(false)}
        visible={visible}
      >
        <Button
          type="text"
          onClick={handleNavigateToCreateProject}
          icon={<PlusOutlined />}
        >
          创建项目
        </Button>
        <Divider />
        {project ? (
          <Menu
            selectable
            selectedKeys={[project.id!.toString()]}
            onSelect={handleProjectChange}
          >
            {projects?.map((v) => (
              <Menu.Item className="uppercase font-semibold" key={v?.id}>
                {v.name}
              </Menu.Item>
            ))}
          </Menu>
        ) : (
          <div />
        )}
      </Drawer>
    </>
  )
}

export default ProjectSelector
