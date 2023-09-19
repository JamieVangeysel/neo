import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'

import pck from '../../package.json'
import { DevicesApiService } from './core/api/devices-api.service'
import { ChartType } from 'ng-apexcharts'

const areaChartType: ChartType = 'area'

const visitorsChart: any = {
  chart: {
    type: areaChartType,
    height: 320,
    toolbar: {
      show: false
    },
    zoom: {
      enabled: false
    },
    selection: {
      enabled: false
    },
    sparkline: {
      enabled: true
    }
  },
  grid: {
    show: true,
    borderColor: 'var(--border-color)',
    xaxis: {
      lines: {
        show: true
      }
    },
    yaxis: {
      lines: {
        show: true
      }
    }
  },
  legend: {
    show: false
  },
  stroke: {
    curve: 'smooth',
    width: 2,
    lineCap: 'round'
  },
  dataLabels: {
    enabled: false
  },
  fill: {
    gradient: {
      shade: 'dark',
      type: 'vertical',
      shadeIntensity: 0.5,
      gradientToColors: undefined,
      inverseColors: true,
      opacityFrom: 1,
      opacityTo: 0.5,
      stops: [0, 35, 100],
      colorStops: []
    },
  },
  tooltip: {
    enabled: true,
    fillSeriesColor: false,
    theme: 'dark',
    followCursor: true,
    onDatasetHover: {
      highlightDataSeries: false,
    },
    y: {
      formatter: function (value: number) {
        return '€ ' + value.toFixed(2)
      }
    }
  },
  xaxis: {
    type: 'datetime',
    // floating: true,
    labels: {
      show: true,
      offsetY: -16,
      //offsetX: -16
      style: {
        colors: '#999'
      }
    }
  },
  yaxis: {
    show: true,
    showAlways: true,
    floating: true,
    forceNiceScale: true,
    min: 0,
    labels: {
      show: true,
      // offsetX: -116
    },
    axisBorder: {
      show: true
    },
    axisTicks: {
      show: true
    }
  }
}

@Component({
  selector: 'neo-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    version: pck.version,
    class: 'relative flex flex-auto w-full'
  }
})
export class AppComponent {
  loading: boolean = true
  temperature_history: any | undefined

  constructor(
    private api: DevicesApiService,
    private ref: ChangeDetectorRef
  ) { this.load() }

  async load() {
    // get data for mathijs bedroom themp sensor
    const response = await this.api.getData<{
      data: any[]
    }>('dac7ca013a360dd79f138b620275032c172715a254f0825d30c4cf77f9b38c6d4606b06549fb0a5cff1e522c007cb46e')

    if (response && response.data) {
      this.loading = false
      this.temperature_history = {
        options: {
          ...visitorsChart,
          series: [{
            name: 'Netto-waarde',
            data: response.data.data.map(e => ({
              x: new Date(e.date).getTime(),
              y: e.temperature
            }))
          }]
        }
      }
      this.ref.markForCheck()
    }
  }
}
