import Highcharts from 'highcharts'

Highcharts.theme = {
  credits: {
    enabled: false,
  },
  colors: ['var(--ant-primary-color)'],
  title: {
    text: undefined,
  },
  chart: {
    spacingTop: 0,
    spacingBottom: 0,
    spacingLeft: 0,
    spacingRight: 0,
    backgroundColor: 'transparent',
  },
  legend: { enabled: false },
  xAxis: {
    title: {
      text: null,
    },
    tickWidth: 0,
    lineWidth: 0,
  },
  yAxis: {
    title: {
      text: null,
    },
    labels: { enabled: false },
    gridLineWidth: 0,
  },
  tooltip: {
    useHTML: true,
    outside: true,
    animation: false,
    backgroundColor: 'white',
    borderWidth: 0,
  },
}
Highcharts.setOptions(Highcharts.theme)
