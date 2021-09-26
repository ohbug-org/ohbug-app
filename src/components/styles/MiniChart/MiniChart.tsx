import { FC, memo } from 'react'
import { Typography, Badge } from 'antd'
import ReactEcharts, { EChartsOption } from 'echarts-for-react'
import dayjs from 'dayjs'

import { useCreation } from '@/hooks'

import './MiniChart.module.less'

type Data = {
  timestamp: string
  count: number
}
interface MiniChartProps {
  trend: '24h' | '14d'
  data?: Data[]
  loading?: boolean
  title?: string
}

const MiniChart: FC<MiniChartProps> = memo(
  ({ trend, data, loading, title }) => {
    const option = useCreation<EChartsOption | null>(
      () => ({
        dataset: {
          source: data,
          dimensions: [{ name: 'timestamp' }, { name: 'count' }],
        },
        xAxis: {
          type: 'category',
          show: false,
        },
        yAxis: {
          type: 'value',
          show: false,
        },
        grid: {
          top: 5,
          bottom: 5,
          left: 0,
          right: 0,
        },
        tooltip: {
          trigger: 'axis',
          padding: [8, 16],
          backgroundColor: 'rgba(50, 50, 50, 0.9)',
          transitionDuration: 0,
          appendToBody: true,
          // @ts-ignore
          position(point, params, dom, rect, size) {
            const { contentSize } = size
            return [point[0] - contentSize[0] / 2, '120%']
          },
          formatter(params: any) {
            const [{ value }] = params
            const { timestamp, count } = value
            if (trend === '24h') {
              return `<div class="tooltip-time">
            ${dayjs(timestamp).format('YYYY-MM-DD')}<br>
            ${dayjs(timestamp).format('h:00 A → h:59 A')}
            </div>

            <div class="tooltip-value">${count} events</div>

            <span class="tooltip-arrow" />
            `
            }
            if (trend === '14d') {
              return `<div class="tooltip-time">${dayjs(timestamp).format(
                'YYYY-MM-DD'
              )}</div>

            <div class="tooltip-value">${count} events</div>

            <span class="tooltip-arrow" />
            `
            }
            return ''
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
            name: 'events',
            type: 'line',
            smooth: true,
            symbol: 'emptyCircle',
            symbolSize: 2,
            showSymbol: false,
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
                    color: 'rgba(28,25,23,0.5)',
                  },
                  {
                    offset: 0.333,
                    color: 'rgba(28,25,23,0.3)',
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
      }),
      [data, trend]
    )

    return data ? (
      <div>
        {title && (
          <Typography.Title level={5}>
            <Badge status="processing" />
            {title}
          </Typography.Title>
        )}
        <ReactEcharts
          option={option}
          style={{ height: '40px' }}
          opts={{ renderer: 'svg' }}
          showLoading={loading}
          theme="ohbug"
        />
      </div>
    ) : null
  }
)

MiniChart.displayName = 'MiniChart'

export default MiniChart
