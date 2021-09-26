import { FC, createElement, isValidElement } from 'react'

import { Loading } from '@/components'
import { RouteComponentProps, Redirect } from '@/ability'
import { useGetProjects } from '@/services'

const Auth: FC<RouteComponentProps> = ({ children }) => {
  const { data, isLoading } = useGetProjects()

  if (isLoading) {
    return createElement(Loading)
  }

  if (data && isValidElement(children)) {
    return children
  }

  return createElement(Redirect, { to: '/getting-started' })
}

export default Auth
