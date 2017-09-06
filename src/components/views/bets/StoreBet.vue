<template>
    <section class="store-bet">
        <Card style="width:750px">
        <Form :model="formItem" :label-width="80">
            <FormItem label="ID">
                <Input v-model="formItem.id" placeholder="ID"></Input>
            </FormItem>
            <FormItem label="Date">
                <DatePicker v-model="formItem.date" type="datetime" format="yyyy-MM-dd HH:mm" placeholder="选择日期和时间（不含秒）" style="width: 200px"></DatePicker>
            </FormItem>
            <FormItem label="Type">
                <i-switch v-model="formItem.single" size="large">
                    <span slot="open">Single</span>
                    <span slot="close">Express</span>
                </i-switch>
            </FormItem>
            <FormItem label="Bet">
                <Row>
                    <Col span="8">
                        <Input v-model="formItem.odds" placeholder="Odds"></Input>
                    </Col>
                    <Col span="8">
                        <Input v-model="formItem.stake" placeholder="Stake"></Input>
                    </Col>
                    <Col span="8">
                        <Input v-model="formItem.currency" placeholder="Currency"></Input>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="Bet info">
                <Row>
                    <Col>
                        <Input v-model="formItem.participants" placeholder="Participants"></Input>
                    </Col>
                </Row>
                <Row>
                    <Input v-model="formItem.pick" placeholder="Pick"></Input>
                </Row>
                <Row>
                    <Input v-model="formItem.winners" placeholder="Winners"></Input>
                </Row>
                <Row>
                    <Col>
                        <Input v-model="formItem.discipline" placeholder="Discipline"></Input>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="Result">
                <i-switch v-model="formItem.won" size="large">
                    <span slot="open">Won</span>
                    <span slot="close">Lost</span>
                </i-switch>
            </FormItem>
            <FormItem label="Website">
                <Input v-model="formItem.website" placeholder="Website"></Input>
            </FormItem>
        </Form>
        <Row>
            <Col span="8" offset="18">
                <ButtonGroup>
                    <Button type="primary" v-on:click="storeBet(true)">{{buttonMessage}}</Button>
                    <Button v-on:click="returnBack()">Cancel</Button>
                </ButtonGroup>
            </Col>
        </Row>
        </Card>
    </section>
</template>

<script>
  import UIBet from '../../../objects/uibet'
  import api from '../../../api'
  import store from '../../../store'
  import moment from 'moment'

  export default {
    name: 'StoreBet',
    props: ['betId'],
    beforeMount () {
      if (this.betId) {
        this.editing = true
        this.formItem.id = this.betId
        this.schema.fields[0].disabled = true
        let _this = this
        api.request('get', 'bets/' + this.betId).then(response => {
          window.console.log(response.data[0])
          let bet = response.data[0]
          if (bet) {
            console.log(_this.formItem)
            console.log(bet.date)
            bet.date = bet.date * 1000
            console.log(bet.date)
            Object.keys(bet).forEach(function (column) {
              if (_this.formItem[column] !== undefined) {
                _this.formItem[column] = bet[column]
              } else {
                switch (column) {
                  case 'type': {
                    _this.formItem.single = (bet[column][0] && bet[column][0] === 'single')
                    break
                  }

                  case 'status': {
                    console.log(bet[column])
                    _this.formItem.won = (bet[column] === 'win')
                    break
                  }
                }
                console.log(column)
                console.log(_this.formItem[column])
              }
            })
          }
        })
      }
    },
    data () {
      return {
        editing: false,
        formItem: {
          id: '',
          date: moment().format("YYYY-MM-DD HH:mm"),
          single: true,
          odds: '',
          stake: '',
          currency: '',
          won: true,
          participants: '',
          pick: '',
          winners: '',
          discipline: '',
          website: ''
        }
      }
    },
    components: {
    },
    computed: {
      buttonMessage () {
        return this.editing ? 'Update bet' : 'Store bet'
      }
    },
    methods: {
      returnBack () {
        this.$emit('cancel')
      },
      storeBet (submit) {
        console.log(this.formItem)
        return
        if (submit) {
          let betdata = this.formItem
          betdata.user = store.state.username
          betdata.date = betdata.date / 1000
          console.log(betdata)
          let bet = new UIBet(betdata)
          bet.status = betdata.won === true ? 'win' : 'loss'
          api.request(this.editing ? 'put' : 'post', 'bets', bet).then(response => {
            window.console.log(response)
            if (response.status === 200 && response.data && response.data._id) {
              this.$notify({
                title: 'Success action',
                type: 'success',
                text: 'Bet was ' + this.editing ? 'saved' : 'imported',
                duration: 3000,
                speed: 1000
              })
              this.$emit('done')
            }
          })
            .catch(function (error) {
              if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data)
                console.log(error.response.status)
                console.log(error.response.headers)
              } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request)
              } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message)
              }
              console.log(error.config)
            })
        }
      },
      onValidated (isValid, errors) {
        // TODO block confirm
        console.log('Validation result: ', isValid, ', Errors:', errors)
      }
    }
  }
</script>

<style>
    .ivu-switch-large.ivu-switch-checked:after {
        left: 47px;
    }

    .ivu-switch-large {
        width: 75px;
    }
</style>
