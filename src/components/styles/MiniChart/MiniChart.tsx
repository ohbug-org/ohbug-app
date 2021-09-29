import { FC, memo } from 'react'
import { Typography, Badge } from 'antd'
import Highcharts, { Options } from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import dayjs from 'dayjs'

import { useCreation } from '@/hooks'

type Data = {
  timestamp: string
  count: number
}
interface MiniChartProps {
  trend: '24h' | '14d'
  data?: Data[]
  title?: string
}

const MiniChart: FC<MiniChartProps> = memo(({ trend, data, title }) => {
  const options = useCreation<Options>(
    () => ({
      chart: {
        height: 60,
        spacingTop: 5,
        spacingBottom: 5,
      },
      xAxis: {
        labels: {
          enabled: false,
        },
      },
      series: [
        {
          type: 'areaspline',
          data: data?.map((v) => ({
            name: v.timestamp,
            y: v.count,
          })),
          lineWidth: 4,
          marker: {
            enabled: false,
          },
          tooltip: {
            headerFormat: '',
            pointFormatter() {
              const { name, y } = this
              if (trend === '24h') {
                return `<div style="text-align: center"><span>${dayjs(
                  name
                ).format('YYYY-MM-DD')}<br />${dayjs(name).format(
                  'h:00 A → h:59 A'
                )}</span><br /><b>${y} events</b></div>`
              }
              if (trend === '14d') {
                return `<div style="text-align: center"><span>${dayjs(
                  name
                ).format('YYYY-MM-DD')}</span><br /><b>${y} events</b></div>`
              }
              return ''
            },
          },
        },
      ],
    }),
    [data, trend]
  )

  return (
    <div>
      {title && (
        <Typography.Title level={5}>
          <Badge status="processing" />
          {title}
        </Typography.Title>
      )}
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  )
})

MiniChart.displayName = 'MiniChart'

export default MiniChart
