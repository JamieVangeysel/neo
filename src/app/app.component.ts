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
        return value.toFixed(2) + ' °C'
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
            name: 'Temperatuur',
            data: response.data.data.map(e => ({
              x: new Date(e.date).getTime(),
              y: e.temperature
            }))
          }, {
            name: 'HeatIndex',
            data: response.data.data.map(e => ({
              x: new Date(e.date).getTime(),
              y: this.calculateHeatIndex(e.temperature, e.humidity)
            }))
          }]
        }
      }
      this.ref.markForCheck()
    }
  }

  calculateHeatIndex(temperature: number, relativeHumidity: number): number {
    const T = (temperature * 1.8) + 32
    const RH = relativeHumidity
    let ADJUSTMENT = 0
    let HI = 0.5 * (T + 61.0 + ((T - 68.0) * 1.2) + (RH * 0.094))

    if ((HI + T) / 2 >= 80) {
      HI = -42.379 + 2.04901523 * T + 10.14333127 * RH - .22475541 * T * RH - .00683783 * T * T - .05481717 * RH * RH + .00122874 * T * T * RH + .00085282 * T * RH * RH - .00000199 * T * T * RH * RH

      if (T >= 80 && T <= 112 && RH <= 13) {
        ADJUSTMENT = -1 * (((13 - RH) / 4) * Math.sqrt((17 - Math.abs(T - 95.)) / 17))
      } else if (T >= 80 && T <= 87 && RH >= 85) {
        ADJUSTMENT = ((RH - 85) / 10) * ((87 - T) / 5)
      }
    }

    return ((HI + ADJUSTMENT - 32) / 1.8)
  }
}
