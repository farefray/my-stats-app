export default class UIBet {
  id = '';
  userid = 1;
  date = '1999-12-10T00:00:00';
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
}
