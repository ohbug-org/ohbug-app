import { FC, createElement, isValidElement } from 'react'
import { useAtom } from 'jotai'

import { Loading } from '@/components'
import { RouteComponentProps, Redirect } from '@/ability'
import { currentProjectAtom } from '@/atoms'

const Auth: FC<RouteComponentProps> = ({ children }) => {
  const [currentProject] = useAtom(currentProjectAtom)

  if (!currentProject) {
    return createElement(Loading)
  }

  if (currentProject && isValidElement(children)) {
    return children
  }

  return createElement(Redirect, { to: '/getting-started' })
}

export default Auth
