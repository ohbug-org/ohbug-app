import type { FC } from 'react'
import { render } from 'react-dom'
import { Provider } from 'jotai'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { ConfigProvider } from 'antd'
import locale from 'antd/lib/locale/zh_CN'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

import Router from '@/ability/router'
import { request } from '@/ability/request'
import { ErrorBoundary } from '@/components'

// eslint-disable-next-line import/no-extraneous-dependencies
import 'tailwindcss/tailwind.css'
import 'antd/dist/antd.dark.less'
import '@/styles/theme.less'
import '@/styles/reset.less'
import '@/styles/charts.theme'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')
dayjs().locale('zh-cn').format()

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
      queryFn: request,
      retry: 3,
    },
  },
})

const App: FC = () => (
  <ErrorBoundary>
    <Provider>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider locale={locale}>
          <Router />
          <ReactQueryDevtools initialIsOpen={false} />
        </ConfigProvider>
      </QueryClientProvider>
    </Provider>
  </ErrorBoundary>
)

render(<App />, document.querySelector('#root'))
