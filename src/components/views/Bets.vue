<template>
  <section class="content">
    <div class="row center-block" v-if="action == 'display_bets'">
      <h2>My stored bets</h2>
      <!--"Middle" type, four sub menu, animation introduced animate.css library, white mask, round custom switch button, default menu color configuration-->
      <circle-menu type="right" :number="2" animate="animated jello" mask='black' circle>
        <a slot="item_1" class="fa fa-plus fa-lg" data-toggle="tooltip" title="Store single bet" v-on:click="switchView('store_bet')"></a>
        <a slot="item_2" class="fa fa-plus fa-lg" data-toggle="tooltip" title="Prase multiple bets" v-on:click="switchView('parse_bets')"></a>
      </circle-menu>
      <div class="col-md-12">
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
      </div>
      <div class="import-menu-bar row">

      </div>
    </div>
    <div class="row center-block" v-if="action == 'store_bet'">
      <store-bet v-on:done="switchView()"></store-bet>
    </div>
    <div class="row center-block" v-if="action == 'parse_bets'">
      <parse-bets v-on:done="switchView()"></parse-bets>
    </div>
  </section>
</template>

<script>
import '../../../node_modules/ag-grid/dist/styles/ag-grid.css'  // TODO resolve this dependancies
import '../../../node_modules/ag-grid/dist/styles/theme-blue.css' // TODO resolve this dependancies
import {AgGridVue} from 'ag-grid-vue'
import {LicenseManager} from 'ag-grid-enterprise/main'
import CircleMenu from 'vue-circle-menu'
import StoreBet from './bets/StoreBet'
import ParseBets from './bets/parser/ParseBets'
import api from '../../api'
import UIBet from '../../objects/uibet'
import moment from 'moment'

LicenseManager.setLicenseKey('ag-Grid_Evaluation_License_Not_For_Production_1Devs21_September_2017__MTUwNTk0ODQwMDAwMA==888b81f2e21810c7ef5e399b5c5d1433')

function getContextMenuItems (params) {
    let result = [
        { // custom item
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
        }, // built in separator
        'separator',
        'copy'
    ]

    return result
}

function dateFormatter (params) {
    return moment.unix(params.value).format('MMM Do YYYY, H:mm:ss')
}

export default {
  name: 'Bets',
  data (router) {
    return {
      action: 'parse_bets',
      storedBets: null,
      gridOptions: null,
      columnDefs: null
    }
  },
  components: {
    'ag-grid-vue': AgGridVue,
    CircleMenu,
    StoreBet,
    ParseBets
  },
  beforeMount () {
    this.gridOptions = {
        getContextMenuItems: getContextMenuItems,
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
      console.log('switchView')
      this.action = act !== undefined ? act : 'display_bets'
      if (this.action === 'display_bets') {
        this.updateBets()
      }
    }
  }
}
</script>

<style>
@CircleMenuBtnColor: #324234;
@CircleMenuItem1Color: #00e676;
@CircleMenuItem2Color: #ffa000;

#CircleMenu {
  position:absolute;
  bottom: 75px;
  right: 1%;
  margin:0;
  padding:5px 3px;
}

</style>
