<template>
  <section class="parse-bets">
    <accordion :one-at-atime="false" type="info">
    <panel :is-open="!rawPasted" type="primary">
      <strong slot="header"><u>Paste raw data here</u></strong>
      <textarea mdInput v-model="raw" required v-on:blur="updateRaw()"
                       placeholder=""></textarea>
    </panel>
    <panel :is-open="rawPasted" header="Help us to parse your data">
      <ag-grid-vue style="width: 100%; height: 350px;" class="ag-blue"
      :gridOptions="gridOptions"
      :columnDefs="columnDefs"
      :rowData="rowData"
      :rowDataChanged="rowDataChanged">
      </ag-grid-vue>
    </panel>
    <panel :is-open="rawPasted" header="Results preview">
      {{statusMessage}}
      <ag-grid-vue style="width: 100%; height: 350px;" class="ag-blue"
      :gridOptions="gridOptions"
      :columnDefs="columnDefs"
      :rowData="rowData"
      :rowDataChanged="rowDataChanged">
      </ag-grid-vue>
    </panel>
  </accordion>
  </section>
</template>

<script>
import { similarity } from './parser.helpers'
import UIBet from '../../../../objects/uibet'
// import api from '../../../api'
import {LicenseManager} from 'ag-grid-enterprise/main'
import {AgGridVue} from 'ag-grid-vue'
import ParserCellComponent from './ParserCellComponent'
import Chrono from 'chrono-node'
import { accordion, panel } from 'vue-strap'
LicenseManager.setLicenseKey('ag-Grid_Evaluation_License_Not_For_Production_1Devs21_September_2017__MTUwNTk0ODQwMDAwMA==888b81f2e21810c7ef5e399b5c5d1433')
var _ = require('lodash/core')

function getMainMenuItems (params) {
  let betExample = new UIBet()
  let menuItems = []
  console.log(params)
  Object.keys(betExample).forEach(function (key) {
    menuItems.push({
        name: key,
        row: params.column.colId,
        params: params,
        action: function (p) {
          console.log(this.row + ' picked ' + key)
          console.log(this)
          let currentData = this.params.api.gridCore.gridOptions.rowData
          for (var i = 0; i <= currentData.length - 1; i++) {
            let value = currentData[i]['' + this.row + ''].value
            switch (key) {
              case 'date': {
                let validateDate = Chrono.parse(value)
                let formattedValue = ''
                if (validateDate.length > 0) {
                  for (var j = 0; j <= validateDate.length - 1; j++) {
                    formattedValue += validateDate[j].text
                  }

                  currentData[i]['' + this.row + ''].type = key
                  currentData[i]['' + this.row + ''].value = (formattedValue)
                  console.log(Date.parse(Chrono.parseDate(currentData[i]['' + this.row + ''].value)))
                } else {
                  console.log('failed')
                }

                break
              }

              case 'discipline': {
                if (value.toLowerCase().indexOf('dota 2') >= 0 || value.toLowerCase().indexOf('dota2') >= 0) {
                  currentData[i]['' + this.row + ''].type = key
                  currentData[i]['' + this.row + ''].value = 'dota 2'
                } else {
                  console.log('failed')
                }

                break
              }

              case 'participants': {
                let participants = value.split(' - ')
                let participantsArray = []
                participants.forEach(function (key) {
                  participantsArray.push(key.split('(')[0].trim())
                })

                currentData[i]['' + this.row + ''].value = participantsArray
                currentData[i]['' + this.row + ''].type = key
                break
              }

              case 'currency':
              case 'stake': {
                let stake = parseInt(value)
                if (stake > 0) {
                  currentData[i]['' + this.row + ''].value = stake
                  currentData[i]['' + this.row + ''].type = key

                  // lets guess currency
                  let currency = value.split(' ')[1]
                  if (currency) {
                    // add it to grid
                    // seems we need to store already parsed bets somewhere else, so we can just set values when changing
                    // two ways, first one is to hold bets in some other object and on this step we gonna fill it.
                    // second way is to add new column here and mark it as currency
                  }
                }
                break
              }

              default: {
                currentData[i]['' + this.row + ''].type = key
              }
            }
          }

          this.params.api.dispatchEvent('rowDataChanged')
        }
        // icon: '<img src="../images/lab.png" style="width: 14px;"/>'
    })
  })

  menuItems.push('resetColumns')
  return menuItems
}

var gridOptions = {
  getMainMenuItems: getMainMenuItems,
  customItem: 'test'
}

function parcerCellFormatter (params) {
    // remove this if not used
    return (params.value)
}

function nextLetter (s) {
    return s.replace(/([a-zA-Z])[^a-zA-Z]*$/, function (a) {
        var c = a.charCodeAt(0)
        switch (c) {
            case 90: {
              return 'A'
            }
            case 122: {
              return 'a'
            }
            default: {
              return String.fromCharCode(++c)
            }
        }
    })
}

export default {
  name: 'ParseBets',
  data () {
    return {
      gridOptions: gridOptions,
      rowData: [],
      columnDefs: [],
      rawPasted: false,
      statusMessage: '',
      raw: `№ 1848025423
from 11.07.2017 | 21:26
Dota 2. Prodota Cup. Best of 3 maps
PENTA - Gambit
Stake
655 UAH
Win:
936.65 UAH
Bet type
Single
Bet slip status
Win
1.43
№ 1844728001
from 10.07.2017 | 15:46
Dota2. Overpower
M19 - PENTA
Stake
100 UAH
Bet type
Accumulator
Bet slip status
Loss
2.915625`,
    elements: [],
    resultedBets: []
    }
  },
  components: {
    'ag-grid-vue': AgGridVue,
    accordion,
    panel
  },
  beforeMount () {
  },
  methods: {
    rowDataChanged () {
      console.log('rowdaachanged')
      let bets = 0
      let reqrd = ''
      let rows = this.rowData
      Object.keys(rows).forEach(function (key) {
        let rawBetData = rows[key]
        let newBet = new UIBet()
        newBet.fill(rawBetData)
        reqrd = newBet.getRequired()
        bets++
      })

      this.statusMessage = bets + ' bet' + (bets > 0 ? 's' : '') + ' to be imported. Missing required fields:' + reqrd
    },
    updateRaw () {
      const rowData = []
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
          if (Object.keys(longestElement).length < Object.keys(fullElement).length) {
            longestElement = fullElement
          }

          fullElement = {}
          letNumber = 97
        }

        fullElement[String.fromCharCode(letNumber)] = {value: el, type: 'none'}
        letNumber++
      }

      rowData.push(fullElement) // last element

      // lets first the longest, which supposed to be the one with max items
      var baseHeaders = []
      Object.keys(longestElement).forEach(function (key) {
        baseHeaders.push({
            headerName: 'select',
            field: key,
            cellRendererFramework: ParserCellComponent,
            valueFormatter: parcerCellFormatter,
            menuTabs: ['generalMenuTab']
        })
      })

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
      console.log(baseHeaders)
      console.log(longestElement)
      this.rowData = rowData
      this.columnDefs = baseHeaders
      this.rawPasted = true
    }
  }
}
</script>

<style>

</style>
