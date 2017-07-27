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
    </panel>
  </accordion>
  </section>
</template>

<script>
import UIBet from '../../../objects/uibet'
// import api from '../../../api'
import {LicenseManager} from 'ag-grid-enterprise/main'
import {AgGridVue} from 'ag-grid-vue'
// import ClickableParentComponent from './ClickableParentComponent'
import ParserCellComponent from './ParserCellComponent'
import Chrono from 'chrono-node'
import { accordion, panel } from 'vue-strap'
LicenseManager.setLicenseKey('ag-Grid_Evaluation_License_Not_For_Production_1Devs21_September_2017__MTUwNTk0ODQwMDAwMA==888b81f2e21810c7ef5e399b5c5d1433')
var _ = require('lodash/core')

function editDistance (s1, s2) {
  s1 = s1.toLowerCase()
  s2 = s2.toLowerCase()

  var costs = []
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i
    for (var j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j
      } else {
        if (j > 0) {
          var newValue = costs[j - 1]
          if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue),
              costs[j]) + 1
            }
          costs[j - 1] = lastValue
          lastValue = newValue
        }
      }
    }

    if (i > 0) {
      costs[s2.length] = lastValue
    }
  }
  return costs[s2.length]
}

function similarity (s1, s2) {
  var longer = s1
  var shorter = s2
  if (s1.length < s2.length) {
    longer = s2
    shorter = s1
  }
  var longerLength = longer.length
  if (longerLength === 0) {
    return 1.0
  }

  let bonus = 0
  if (longer === shorter) {
    bonus += 0.5
  }

  return bonus + (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength)
}

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
      raw: `№ 1862910769
from 17.07.2017 | 12:41
Dota 2. World Cyber Arena. Qualification. Best of 3 maps
Execration - Rex Regum Qeon (1 map)
Stake
250 UAH
Bet type
Single
Bet slip status
Loss
2.37
№ 1862672859
from 17.07.2017 | 10:26
Dota2. WCA Quali
Execration - RRQ
Stake
250 UAH
Win:
326 UAH
Bet type
Accumulator
Bet slip status
Win
1.304
№ 1861388995
from 16.07.2017 | 19:20
Dota 2. Overpower Cup. Best of 3 maps
PENTA - dd
Stake
250 UAH
Bet type
Single
Bet slip status
Loss
2.56`,
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

      this.statusMessage = bets + ' bet ' + (bets > 0 ? 's' : '') + ' to be imported. Missing required fields:' + reqrd
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
        } else if (el.length === first.length) {
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
            // rowData[i][key]['value'] = rowData[i][key]['value'] + ' (' + (similarity(currentBet[key]['value'], longestElement[key]['value'])) + ')'
            let similar = currentBet[key]['value'] === '' ? 1 : (similarity(currentBet[key]['value'], longestElement[key]['value'])) // only compare if not empty
            if (similar === 0) {
              // check 1-2 next elements for better similarity
              let nextkey = nextLetter(key)
              let needToMove = 0
              for (let n = 1; n <= 2; n++) {
                  if ((similarity(rowData[i][nextkey]['value'], longestElement[key]['value'])) > similar) {
                    console.log(rowData[i][key]['value'] + ' need to move for ' + n)
                    needToMove = n
                  }

                  nextkey = nextLetter(key)
              }

              // debugger
              if (needToMove > 0) {
                for (let m = 0; m < needToMove; m++) {
                  console.log('mvongin')
                  // move
                  var curr = _.clone(rowData[i][key])
                  rowData[i][key]['value'] = ''
                  rowData[i][key]['type'] = 'none'
                  console.log(curr)
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
