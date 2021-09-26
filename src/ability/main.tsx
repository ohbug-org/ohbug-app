import type { FC } from 'react'
import { render } from 'react-dom'
import { RecoilRoot } from 'recoil'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { ConfigProvider } from 'antd'
import locale from 'antd/lib/locale/zh_CN'
import * as echarts from 'echarts'
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
echarts.registerTheme('ohbug', chartTheme.theme)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
      // @ts-ignore
      queryFn: request,
      retry: 3,
    },
  },
})

const App: FC = () => (
  <RecoilRoot>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider renderEmpty={renderEmpty} locale={locale}>
        <Router />
        <ReactQueryDevtools initialIsOpen={false} />
      </ConfigProvider>
    </QueryClientProvider>
  </RecoilRoot>
)

render(<App />, document.querySelector('#root'))
