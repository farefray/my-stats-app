<template>
    <div class="echarts">
        {{balance}}
        <IEcharts :option="opts" :loading="loading" @ready="onReady" @click="onClick" v-if="ready"></IEcharts>
    </div>
</template>

<script type="text/babel">
  import IEcharts from 'vue-echarts-v3/src/full.vue'
  let graphic = {}
  graphic.LinearGradient = require('zrender/lib/graphic/LinearGradient')

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
      if (this.chartdata !== null) {
        this.loading = false
      }
    },
    watch: {
      chartdata: function (val) {
        console.log(this.chartdata)
        console.log(val)
        if (val === null) {
          return
        }

        this.ready = true
        this.opts = {
          backgroundColor: 'rgba(137,189,125,0.1)',
          tooltip: {
            show: true,
            formatter: function (params) {
              console.log(params)
              return '{b0}: {c0}<br />{b1}: {c1}'
            },
            trigger: 'axis',
            axisPointer: {
              lineStyle: {
                type: 'cross'
              }
            }
          },
          axisPointer: {
            link: {
              xAxisIndex: 'all'
            },
            label: {
              backgroundColor: '#777'
            }
          },
          calculable: true,
          dataZoom: {
            type: 'slider',
            show: true,
            realtime: true,
            start: 0,
            end: 100
          },
          toolbox: {
            show: true,
            itemSize: 15,
            itemGap: 10,
            feature: {
              dataView: {
                title: 'View data',
                readOnly: false,
                show: true,
                lang: ['data view', 'turn off', 'refresh'],
                optionToContent: function (opt) {
                  console.log(opt)
                  let axisData = opt.xAxis[0].data
                  let series = opt.series
                  let table = '<table style="width:100%;text-align:center"><tbody><tr>' +
                    '<td>Time:</td>' +
                    '<td>' + series[0].name + '</td>' +
                    '</tr>'

                  for (let i = 0, l = axisData.length; i < l; i++) {
                    table += '<tr>' +
                      '<td>' + axisData[i] + '</td>' +
                      '<td>' + series[0].data[i] + '</td>' +
                      '</tr>'
                  }

                  table += '</tbody></table>'
                  return table
                }
              },
              magicType: {
                show: true,
                type: ['line', 'bar']
              },
              saveAsImage: {
                show: true,
                name: 'MyBettingStats',
                title: 'Save as image'
              }
            }
          },
          legend: {
            icon: 'rect',
            itemWidth: 14,
            itemHeight: 5,
            itemGap: 13,
            data: ['Balance'],
            right: '4%',
            textStyle: {
              fontSize: 12,
              color: '#F1F1F3'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [{
            type: 'category',
            boundaryGap: false,
            axisLine: {
              lineStyle: {
                color: '#57617B'
              }
            },
            data: val.labels
          }],
          yAxis: [{
            type: 'value',
            name: 'Profit',
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#57617B'
              }
            },
            axisLabel: {
              margin: 10,
              textStyle: {
                fontSize: 14
              }
            },
            splitLine: {
              lineStyle: {
                color: '#57617B'
              }
            }
          }],
          series: [{
            name: 'Timeline',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
              normal: {
                color: '#414141',
                width: 2
              }
            },
            areaStyle: {
              normal: {
                color: new graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 1,
                  color: '#960208' // 0%
                }, {
                  offset: 0,
                  color: '#00842b' // 100%
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 10
              }
            },
            itemStyle: {
              normal: {
                color: 'rgb(137,189,27)',
                borderColor: 'rgba(137,189,2,0.27)',
                borderWidth: 12
              }
            },
            data: val.data
          }
          ]
        }
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