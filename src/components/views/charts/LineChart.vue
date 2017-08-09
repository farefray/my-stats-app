<template>
    <div class="echarts">
        {{balance}}
        <IEcharts :option="opts" :loading="loading" @ready="onReady" @click="onClick"></IEcharts>
    </div>
</template>

<script type="text/babel">
  import IEcharts from 'vue-echarts-v3/src/full.vue'

  export default {
    name: 'LineChart',
    components: {
      IEcharts
    },
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
        let asd = true
        if (val === null || asd) {
          return
        }

        this.opts = {
          backgroundColor: '#394056',
          tooltip: {
            formatter: function (params) {
              console.log(params)
              return '{b0}: {c0}<br />{b1}: {c1}'
            },
            trigger: 'axis',
            axisPointer: {
              lineStyle: {
                color: '#57617B'
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
                width: 1
              }
            },
            areaStyle: {
              normal: {
                color: 'rgba(137, 189, 27, 0.3)',
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
    computed: {
      balance () {
        return this.chartdata !== null && this.chartdata.balance !== undefined ? this.chartdata.balance : 0
      }
    },
    data: () => ({
      opts: {
        backgroundColor: '#394056',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: '#57617B'
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
          axisLine: {
            lineStyle: {
              color: '#57617B'
            }
          },
          data: ['5', '6', '9', '13', '19', '33']
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
              width: 1
            }
          },
          areaStyle: {
            normal: {
              color: 'rgba(137, 189, 27, 0.3)',
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
          data: [11, 22, 33, 44, 55, 66],
          markPoint: {
            data: [
              {
                name: 'asdas',
                coord: ['5', 33.4],
                value: 2300,
                itemStyle: {
                  normal: { color: 'rgb(41,60,85)' }
                }
              }
            ],
            tooltip: {
              formatter: function (param) {
                return 'asd'
              }
            }
          }
        }
        ]
      },
      loading: true
    }),
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