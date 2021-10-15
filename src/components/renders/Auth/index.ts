import { FC, createElement, isValidElement } from 'react'
import { useAtom } from 'jotai'

import { RouteComponentProps, Redirect } from '@/ability'
import { userAtom, currentProjectAtom } from '@/atoms'

const Auth: FC<RouteComponentProps> = ({ children }) => {
  const [user] = useAtom(userAtom)
  const [currentProject] = useAtom(currentProjectAtom)

  if (!user) {
    return createElement(Redirect, { to: '/login' })
  }

  if (currentProject && isValidElement(children)) {
    return children
  }

  return createElement(Redirect, { to: '/getting-started' })
}

export default Auth
