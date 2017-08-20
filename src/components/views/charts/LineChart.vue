<template>
    <div class="echarts">
        {{balance}}
        <IEcharts :option="opts" :loading="loading" @ready="onReady" @click="onClick" v-if="ready"></IEcharts>
    </div>
</template>

<script type="text/babel">
  import IEcharts from 'vue-echarts-v3/src/full.vue'
  import settings from './linechart.settings'
  const bows = require('bows')
  var log = bows('LineChart')

  export default {
    name: 'LineChart',
    components: {
      IEcharts
    },
    computed: {
      balance () {
        return this.chartdata !== null && this.chartdata.balance !== undefined ? this.chartdata.balance : 0
      }
    },
    data: () => ({
      opts: {},
      loading: true,
      ready: false
    }),
    props: ['chartdata'],
    updated () {
      console.log('updated')
      console.log(this.chartdata)
    },
    watch: {
      chartdata: function (val) {
        console.log(this.chartdata)
        console.log(val)
        if (val === null) {
          return
        }

        settings.series[0].data = val.data
        settings.xAxis[0].data = val.labels
        log(settings)
        this.opts = settings
        this.loading = false
        this.ready = true
      }
    },
    mounted () {
      console.log('chart mounted')
      console.log(this.chartdata)
    },
    methods: {
      onReady (instance) {
        console.log(instance)
      },
      onClick (event, instance, echarts) {
        console.log(arguments)
      }
    }
  }
</script>

<style scoped>
    .echarts {
        width: 1200px;
        height: 450px;
        margin: auto;
    }
</style>
