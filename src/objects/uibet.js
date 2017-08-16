import Chrono from 'chrono-node'
import moment from 'moment'
const bows = require('bows')
var log = bows('UIBet')

export default class UIBet {
  id = '';
  userid = 1;
  date = 0;
  type = '';
  odds = 1;
  stake = 0;
  currency = 'USD';
  status = '';
  discipline = '';
  participants = ['', ''];
  pick = [''];
  winners = [''];
  website = '';

  constructor (data) {
    if (data !== undefined) {
      this.id = data.id
      this.userid = data.userid
      this.date = data.date
      this.type = data.type
      this.odds = data.odds
      this.stake = data.stake
      this.currency = data.currency
      this.status = data.status
      this.discipline = data.discipline
      this.participants = data.participants
      this.pick = data.pick
      this.winners = data.winners
      this.website = data.website
    }
  }

  fill (rawData) {
    let _this = this
    Object.keys(rawData).forEach(function (key) {
      let rawBetData = rawData[key]
      if (rawBetData.type !== 'none') {
        _this[rawBetData.type] = rawBetData.storeValue ? rawBetData.storeValue : rawBetData.value
      }
    })
  }

  getRequired () {
    // returns fields which are not yet filled, in order to store this bet
    let _this = this
    let emptyExample = new UIBet()
    let returnArray = []
    Object.getOwnPropertyNames(this).forEach(function (key) {
      if (_this[key] === emptyExample[key]) {
        returnArray.push(key)
      }
    })

    return returnArray
  }

  validate (key, value, strict = false) {
    if (!value || !value.length) {
      if (strict === true) {
        return false
      }

      return {
        type: key,
        value: value
      }
    }

    switch (key) {
      case 'date': {
        // 1xbet hacks
        if (value.indexOf('from ')) {
          value = value.replace('from ', '')
        }

        if (value.indexOf(' | ')) {
          value = value.replace(' | ', ' ') + ':00'
        }

        let validateDate = Chrono.parseDate(value)
        log(validateDate)
        if (validateDate && validateDate !== null) {
          log(validateDate)
          let momentDate = moment(validateDate)
          return {
            type: key,
            storeValue: momentDate.unix(),
            value: momentDate.format('D MMM HH:mm')
          }
        }

        return false
      }

      case 'discipline': {
        if (value.toLowerCase().indexOf('dota 2') >= 0 || value.toLowerCase().indexOf('dota2') >= 0) {
          return {
            type: key,
            value: 'dota 2'
          }
        } else if (value.toLowerCase().indexOf('starcraft 2') >= 0 || value.toLowerCase().indexOf('sc2') >= 0 || value.toLowerCase().indexOf('starCraft II') >= 0) {
          return {
            type: key,
            value: 'starcraft 2'
          }
        }

        return false
      }

      case 'participants': {
        if (!value.indexOf(' - ')) {
          return false
        }

        let participants = value.split(' - ')
        if (!participants.length || participants.length === 1) {
          return false
        }

        let participantsArray = []
        participants.forEach(function (key) {
          participantsArray.push(key.split('(')[0].trim())
        })

        return {
          type: key,
          value: participantsArray
        }
      }

      case 'stake': {
        let stake = parseInt(value)
        if (stake > 0) {
          return {
            type: key,
            value: stake
          }
          // TODO what if currency is in the same field
          // lets guess currency
          /*  */
        }

        return false
      }

      case 'currency': {
        // TODO
        /* let currency = typeof value === 'string' ? value.split(' ')[1] : false
        if (currency) {
          currentData[i]['x'] = {}
          currentData[i]['x'].value = currency
          currentData[i]['x'].type = 'currency'
        } */

        return false
      }

      case 'type': {
        let types = ['single', 'multi', 'accumulator', 'express']
        if (types.indexOf(value.toLowerCase()) !== -1) {
          return {
            type: key,
            value: value.toLowerCase() === 'single' ? 'single' : 'multi'
          }
        }

        return false
      }

      case 'status': {
        let statuses = ['win', 'loss', 'pending']
        if (value && value.length > 0 && statuses.indexOf(value.toLowerCase()) !== -1) {
          return {
            type: key,
            value: value.toLowerCase()
          }
        }

        return false
      }

      case 'odds': {
        if ((/^\d+.\d+$/).test(value)) {
          return {
            type: key,
            value: value
          }
        }

        return false
      }

      default: {
        // no rules
        if (strict === true) {
          return false
        }

        return {
          type: key,
          value: value
        }
      }
    }
  }
}
