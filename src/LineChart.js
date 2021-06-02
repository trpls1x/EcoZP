import { Line, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: Line,
  mixins: [reactiveProp],
  props: {
    options: {
      maintainAspectRatio: false,
      responsive: true
    }
  },
  mounted () {
    this.renderChart(this.chartData, this.chartOptions)
  }
}