import Highcharts from 'highcharts'

Highcharts.theme = {
  credits: {
    enabled: false,
  },
  colors: [
    '#02b176',
    '#50B432',
    '#ED561B',
    '#DDDF00',
    '#24CBE5',
    '#64E572',
    '#FF9655',
    '#FFF263',
    '#6AF9C4',
  ],
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
  },
}
Highcharts.setOptions(Highcharts.theme)
