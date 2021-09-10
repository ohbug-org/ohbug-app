import { FC, memo } from 'react'
import { Typography, Badge } from 'antd'
import ReactEcharts, { EChartsOption } from 'echarts-for-react'
import dayjs from 'dayjs'

import { useCreation } from '@/hooks'

import './LineChart.module.less'

// 判断时间是 近14天/近24h/其他时间
export function switchTimeRange(
  start: Data | undefined,
  end: Data | undefined
) {
  const timeStart = dayjs(start?.timestamp)
  const timeEnd = dayjs(end?.timestamp)
  const diff = timeEnd.diff(timeStart, 'hour')
  // 312 23
  switch (diff) {
    // 14天
    case 312:
      return 'YYYY-MM-DD'
    // 24小时
    case 23:
      return 'YYYY-MM-DD HH:mm:ss'
    default:
      return 'YYYY-MM-DD HH:mm:ss'
  }
}

type Data = {
  timestamp: number
  count: number
}
interface LineChartProps {
  data?: Data[]
  loading?: boolean
  title?: string
}

const LineChart: FC<LineChartProps> = memo(({ data, loading, title }) => {
  const option = useCreation<EChartsOption | null>(() => {
    if (data) {
      const start = data[0]
      const end = data[data.length - 1]
      const timeFormat = switchTimeRange(start, end)
      return {
        dataset: {
          source: data,
          dimensions: [{ name: 'timestamp' }, { name: 'count' }],
        },
        xAxis: {
          type: 'category',
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            lineHeight: 25,
            formatter(timestamp: number) {
              return dayjs(timestamp).format(timeFormat)
            },
          },
        },
        yAxis: {
          type: 'value',
          show: false,
        },
        grid: {
          top: 10,
          bottom: 25,
          left: 0,
          right: 0,
        },
        tooltip: {
          trigger: 'axis',
          padding: [8, 16],
          backgroundColor: 'rgba(50, 50, 50, 0.9)',
          formatter(params: any) {
            const [{ value }] = params
            const { timestamp, count } = value
            return `<div class="tooltip-time">${dayjs(timestamp).format(
              timeFormat
            )}</div>

            <div class="tooltip-value">${count} issues</div>

            <span class="tooltip-arrow" />
          `
          },
          textStyle: {
            fontWeight: 'bolder',
            fontSize: 12,
            lineHeight: 1,
            color: '#fafafa',
          },
          extraCssText: 'text-align: center;',
        },
        series: [
          {
            name: 'issues',
            type: 'line',
            smooth: true,
            symbolSize: 6,
            showSymbol: false,
            itemStyle: {
              lineStyle: {
                width: 4,
              },
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgba(28,25,23,0.25)',
                  },
                  {
                    offset: 0.333,
                    color: 'rgba(28,25,23,0.2)',
                  },
                  {
                    offset: 0.666,
                    color: 'rgba(28,25,23,0.1)',
                  },
                  {
                    offset: 1,
                    color: 'rgba(28,25,23,0)',
                  },
                ],
              },
            },
          },
        ],
      }
    }
    return null
  }, [data])

  return option ? (
    <div>
      {title && (
        <div>
          <Badge status="processing" />
          <Typography.Text strong>{title}</Typography.Text>
        </div>
      )}
      <ReactEcharts
        option={option}
        style={{ height: '160px' }}
        showLoading={loading}
        theme="ohbug"
      />
    </div>
  ) : null
})

LineChart.displayName = 'LineChart'

export default LineChart
