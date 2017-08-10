<template>
  <section class="parse-bets">
    <accordion :one-at-atime="false" type="info">
    <panel :is-open="!rawPasted" type="primary">
      <strong slot="header"><u>Paste raw data here</u></strong>
      <textarea mdInput v-model="raw" required v-on:blur="updateRaw()"
                       placeholder=""></textarea>
    </panel>
    <panel :is-open="rawPasted" header="Help us to parse your data" disabled="disabled">
      <raw-pasted-table :rowData="rowData" v-on:parsed="processParced"></raw-pasted-table>
    </panel>
    <panel :is-open="false" header="Results preview">
      <pre-import-table :parsedBets="parsedBets" v-on:imported="onImported"></pre-import-table>
    </panel>
  </accordion>
  </section>
</template>

<script>
import { similarity, nextLetter } from './parser.helpers'

// import api from '../../../api'
import { accordion, panel } from 'vue-strap'
var _ = require('lodash/core')

export default {
  name: 'ParseBets',
  data () {
    return {
      statusMessage: '',
      raw: '',
      rowData: '',
      elements: [],
      resultedBets: [],
      rawProcessed: false,
      parsedBets: null,
      rawPasted: false
    }
  },
  components: {
    'raw-pasted-table': () => import('./RawPastedTable'),
    'pre-import-table': () => import('./PreImportTable'),
    accordion,
    panel
  },
  methods: {
    onImported () {
      alert('ooohohohoh')
    },
    processParced (parsedBets) {
      this.rawProcessed = true
      this.parsedBets = parsedBets
      console.log('parsed bets')
      console.log(parsedBets)
    },
    updateRaw () {
      let rowData = []
      let parsed = this.raw.split('\n')
      let fullElement = {}
      let first = null
      let letNumber = 97
      let longestElement = {}
      for (var i = 0; i <= parsed.length - 1; i++) {
        let el = parsed[i]
        if (first === null) {
          first = el
        } else if (el.length === first.length && similarity(el, first) > 0.5) {
          // thats new row
          // TODO what if next row assidently is same length
          rowData.push(fullElement)
          fullElement = {}
          letNumber = 97
        }

        fullElement[String.fromCharCode(letNumber)] = {value: el, type: 'none'}

        if (Object.keys(longestElement).length < Object.keys(fullElement).length) {
          longestElement = fullElement
        }

        letNumber++
      }

      rowData.push(fullElement) // last element

      // now lets try to fill missed fields and make our table grouped by simple element types
      for (let i = 0; i <= rowData.length - 1; i++) {
        let currentBet = rowData[i]
        if (Object.keys(currentBet).length < Object.keys(longestElement).length) {
          // this bet has not all data, lets guess missed ones.
          Object.keys(currentBet).forEach(function (key) {
            // debug
            let similar = currentBet[key]['value'] === '' ? 1 : (similarity(currentBet[key]['value'], longestElement[key]['value']))
            if (similar <= 0.5) {
              // console.log(rowData[i][key]['value'] + ' need to move. Lets search more than ' + similar)
              // check 1-2 next elements for better similarity
              let nextkey = nextLetter(key)
              let needToMove = 0
              for (var n = 1; n <= 2; n++) {
                  // console.log('checking ' + longestElement[nextkey]['value'] + ' and: ' + (similarity(rowData[i][key]['value'], longestElement[nextkey]['value'])))
                  if ((similarity(rowData[i][key]['value'], longestElement[nextkey]['value'])) > similar) {
                    // console.log(rowData[i][key]['value'] + ' need to move for ' + n + ' cuz its more silimar to ' + longestElement[nextkey]['value'])
                    similar = (similarity(rowData[i][key]['value'], longestElement[nextkey]['value']))
                    needToMove = n
                  }

                  nextkey = nextLetter(nextkey)
              }

              // debugger
              if (needToMove > 0) {
                for (var m = 0; m < needToMove; m++) {
                  // console.log('mvongin')
                  // move
                  var curr = _.clone(rowData[i][key])
                  rowData[i][key]['value'] = ''
                  rowData[i][key]['type'] = 'none'
                  // console.log(curr)
                  // TODO use some default state object for this
                  let kkey = nextLetter(key)
                  while (longestElement[kkey] !== undefined) {
                    let tmp = _.clone(curr)
                    curr = _.clone(rowData[i][kkey])
                    rowData[i][kkey] = tmp
                    kkey = nextLetter(kkey)
                  }
                }
              }
            } else {
              rowData[i][key]['similarity'] = (similarity(currentBet[key]['value'], longestElement[key]['value']))
            }
          })
        }
      }

      console.log(rowData)
      this.rowData = rowData

      let _this = this
      setTimeout(function () {
        _this.rawPasted = true
      }, 500)
    }
  }
}
</script>

<style>

</style>
