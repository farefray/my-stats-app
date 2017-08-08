import { Line, mixins } from 'vue-chartjs'

export default Line.extend({
  mixins: [mixins.reactiveProp],
  created () { },
  mounted () {
    this.$nextTick(() => {
      this.renderChart(this.data, {
        responsive: true,
        maintainAspectRatio: false,
        hover: {
          // Overrides the global setting
          mode: 'index'
        }
      })
    })
  },
  computed: {
    data () {
      return this.chartData
    }
  },
  methods: { }
})
