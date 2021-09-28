import { FC, Suspense } from 'react'
import { Result, Button } from 'antd'
import { QueryErrorResetBoundary } from 'react-query'
import { ErrorBoundary as Base } from 'react-error-boundary'

import { Loading } from '@/components'

const ErrorBoundary: FC = ({ children }) => (
  <QueryErrorResetBoundary>
    {({ reset }) => (
      <Base
        onReset={reset}
        fallbackRender={({ error, resetErrorBoundary }) => (
          <Result
            status="error"
            title="未知错误"
            extra={[
              <Button key="buy" onClick={() => resetErrorBoundary()}>
                再试一次
              </Button>,
            ]}
          >
            <pre>{error.stack}</pre>
          </Result>
        )}
      >
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </Base>
    )}
  </QueryErrorResetBoundary>
)

export default ErrorBoundary
