import type { FC } from 'react'
import { render } from 'react-dom'
import { Provider } from 'jotai'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { ConfigProvider } from 'antd'
import locale from 'antd/lib/locale/zh_CN'
import { registerTheme } from 'echarts'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

import { renderEmpty } from '@/components'
import Router from '@/ability/router'
import chartTheme from '@/styles/chart.json'
import { request } from '@/ability/request'

// eslint-disable-next-line import/no-extraneous-dependencies
import 'tailwindcss/tailwind.css'
import '@/styles/theme.less'
import '@/styles/reset.less'

if (import.meta.env.DEV) {
  import('antd/dist/antd.less')
}

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')
dayjs().locale('zh-cn').format()
registerTheme('ohbug', chartTheme.theme)
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
  <Provider>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider renderEmpty={renderEmpty} locale={locale}>
        <Router />
        <ReactQueryDevtools initialIsOpen={false} />
      </ConfigProvider>
    </QueryClientProvider>
  </Provider>
)

render(<App />, document.querySelector('#root'))
