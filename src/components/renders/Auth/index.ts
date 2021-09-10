import { FC, createElement, isValidElement } from 'react'

import { Loading } from '@/components'
import { RouteComponentProps, useModelEffect, Redirect } from '@/ability'

const Auth: FC<RouteComponentProps> = ({ children }) => {
  const { data, loading } = useModelEffect((dispatch) => dispatch.project.get)

  if (loading) {
    return createElement(Loading)
  }

  if (data && isValidElement(children)) {
    return children
  }

  return createElement(Redirect, { to: '/getting-started' })
}

export default Auth
