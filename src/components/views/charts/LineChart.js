import { Line, mixins } from 'vue-chartjs'

export default Line.extend({
  mixins: [mixins.reactiveProp],
  created () { },
  mounted () {
    this.$nextTick(() => {
      this.renderChart(this.data, {responsive: true, maintainAspectRatio: false})
    })
  },
  computed: {
    data () {
      return this.chartData
    }
  },
  methods: { }
})
