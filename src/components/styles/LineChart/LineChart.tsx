import { FC, memo } from 'react'
import { Typography, Badge } from 'antd'
import Highcharts, { Options } from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

import { useCreation } from '@/hooks'

type Data = {
  name: number
  y: number
}
interface LineChartProps {
  data?: Data[]
  title?: string
}

const LineChart: FC<LineChartProps> = memo(({ data, title }) => {
  const options = useCreation<Options>(
    () => ({
      chart: {
        height: 200,
        spacingTop: 10,
        spacingBottom: 25,
      },
      xAxis: {
        categories: data?.map((v) => v.name.toString()),
      },
      series: [
        {
          type: 'areaspline',
          data,
          lineWidth: 4,
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

LineChart.displayName = 'LineChart'

export default LineChart
