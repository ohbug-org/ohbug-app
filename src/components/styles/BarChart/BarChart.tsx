import { FC, memo } from 'react'
import { Typography, Badge } from 'antd'
import Highcharts, { Options } from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

import { useCreation } from '@/hooks'

type Data = {
  timestamp: string
  count: number
}
interface BarChartProps {
  data?: Data[]
  title?: string
}

const BarChart: FC<BarChartProps> = memo(({ data, title }) => {
  const options = useCreation<Options>(
    () => ({
      chart: {
        height: 200,
        spacingTop: 10,
        spacingBottom: 25,
      },
      colors: ['#6e7373'],
      xAxis: {
        categories: data?.map((v) => v.timestamp),
      },
      series: [
        {
          type: 'column',
          data: data?.map((v) => ({
            name: v.timestamp,
            y: v.count,
          })),
          groupPadding: 0.05,
          lineWidth: 4,
          borderWidth: 0,
          cursor: 'pointer',
          states: {
            hover: {
              animation: false,
              color: 'var(--ant-primary-color)',
            },
          },
          tooltip: {
            headerFormat: '',
            pointFormatter() {
              const { name, y } = this
              return `<div style="text-align: center">${name}<br/><b>${y}</b> issues</div>`
            },
          },
        },
      ],
    }),
    [data]
  )

  return (
    <div>
      {title && (
        <div>
          <Badge status="processing" />
          <Typography.Text strong>{title}</Typography.Text>
        </div>
      )}
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  )
})

BarChart.displayName = 'BarChart'

export default BarChart
