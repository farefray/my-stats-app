<template>
  <section class="content">
    <div class="row center-block" v-if="action == LIST">
      <h2>My stored bets</h2>
      <Row>
        <Col span="8" offset="20">
          <ButtonGroup>
            <Button type="primary" v-on:click="switchView(EDIT)">Store single bet</Button>
            <Button type="primary" v-on:click="switchView(PARSER)">Prase multiple bets</Button>
          </ButtonGroup>
        </Col>
      </Row>
      <Row>
        <div class="box">
          <div class="box-body">
            <ag-grid-vue style="width: 100%; height: 750px;" class="ag-blue"
             :gridOptions="gridOptions"
             :columnDefs="columnDefs"
             :rowData="storedBets"
             :enableSorting="true">
            </ag-grid-vue>
          </div>
        </div>
      </Row>
    </div>
    <div class="row center-block" v-if="action == EDIT">
      <store-bet v-on:cancel="switchView(LIST)"  v-on:done="switchView()" :betId="editing_bet"></store-bet>
    </div>
    <div class="row center-block" v-if="action == PARSER">
      <parse-bets v-on:done="switchView()"></parse-bets>
    </div>
  </section>
</template>

<script>
import '../../../node_modules/ag-grid/dist/styles/ag-grid.css'  // TODO resolve this dependancies
import '../../../node_modules/ag-grid/dist/styles/theme-blue.css' // TODO resolve this dependancies
import {AgGridVue} from 'ag-grid-vue'
import {LicenseManager} from 'ag-grid-enterprise/main'
import StoreBet from './bets/StoreBet'
import ParseBets from './bets/parser/ParseBets'
import api from '../../api'
import UIBet from '../../objects/uibet'
import moment from 'moment'

LicenseManager.setLicenseKey('ag-Grid_Evaluation_License_Not_For_Production_1Devs21_September_2017__MTUwNTk0ODQwMDAwMA==888b81f2e21810c7ef5e399b5c5d1433')

function dateFormatter (params) {
    return moment.unix(params.value).format('MMM Do YYYY, H:mm:ss')
}

// Modes for view
const LIST = 0
const EDIT = 1
const PARSER = 2

export default {
  name: 'Bets',
  data (router) {
    return {
      LIST: LIST,
      EDIT: EDIT,
      PARSER: PARSER,
      action: LIST,
      editing_bet: null,
      storedBets: null,
      gridOptions: null,
      columnDefs: null
    }
  },
  components: {
    'ag-grid-vue': AgGridVue,
    StoreBet,
    ParseBets
  },
  beforeMount () {
    let _this = this
    this.gridOptions = {
        getContextMenuItems: function (params) {
          return [
            {
              name: 'Edit',
              action: function () {
                console.log(params)
                _this.action = EDIT
                _this.editing_bet = params.node.data.id
              },
              icon: ''
            },
            'separator',
            {
              name: 'Remove',
              action: function () {
                console.log(this)
                console.log(params)
                let bet = new UIBet(params.node.data)
                api.request('delete', 'bets', {
                  bet
                }).then(response => {
                  console.log(response)
                  delete params.api.gridCore.gridOptions.rowData.splice(params.node.rowIndex, 1)
                  params.api.refreshCells()
                })
              },
              icon: '<img src="/static/img/remove.gif"/>'
            }
          ]
        },
        animateRows: true
    }
    this.createColumnDefs()
  },
  mounted () {
    this.$nextTick(() => {
      this.updateBets()
    })
  },
  methods: {
    createColumnDefs () {
        let newBet = new UIBet()
        let baseHeaders = []
        Object.keys(newBet).forEach(function (key) {
          let header = {
              headerName: key,
              field: key,
              menuTabs: []
          }

          switch (key) {
            case 'userid': {
              return
            }

            case 'date': {
              header['cellRenderer'] = dateFormatter
              console.log(header)
              break
            }

            default: {
              break
            }
          }

          baseHeaders.push(header)
        })

        this.columnDefs = baseHeaders
    },
    updateBets () {
      let _this = this
      api.request('get', 'bets').then(response => {
          if (response.data) {
            _this.storedBets = response.data
              this.gridOptions.api.sizeColumnsToFit()
          }
        })
    },
    switchView (act) {
      this.editing_bet = null
      console.log('switchView')
      this.action = act !== undefined ? act : LIST
      if (this.action === LIST) {
        this.updateBets()
      }
    }
  }
}
</script>

<style>


</style>
