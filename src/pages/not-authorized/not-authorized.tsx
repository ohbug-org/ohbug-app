import type { FC } from 'react'
import { Result, Button } from 'antd'

import { RouteComponentProps, Link } from '@/ability'

const NotAuthorized: FC<RouteComponentProps> = () => (
  <Result
    status="403"
    title="403"
    style={{
      background: 'none',
    }}
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Link to="/">
        <Button type="primary">Back Home</Button>
      </Link>
    }
  />
)

export default NotAuthorized
