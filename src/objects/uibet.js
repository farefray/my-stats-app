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
}
