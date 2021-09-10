import type { FC } from 'react'
import { Result, Button } from 'antd'

import { RouteComponentProps, Link } from '@/ability'

const NotFound: FC<RouteComponentProps> = () => (
  <Result
    status="404"
    title="404"
    style={{
      background: 'none',
    }}
    subTitle="Sorry, the page you visited does not exist."
    extra={
      <Link to="/">
        <Button type="primary">Back Home</Button>
      </Link>
    }
  />
)
export default NotFound
