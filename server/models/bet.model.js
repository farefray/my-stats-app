import Promise from 'bluebird'
import mongoose from 'mongoose'
import httpStatus from 'http-status'
import APIError from '../helpers/APIError'

/**
 * User Schema
 */
const BetSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true
  },
  _owner: {
    type: String,
    ref: 'User'
  },
  date: {
    type: Number
  },
  type: {
    type: [{
      type: String,
      enum: ['single', 'multi']
    }],
    default: ['single']
  },
  odds: {
    type: Number
  },
  stake: {
    type: Number
  },
  currency: {
    type: String
  },
  status: {
    type: String,
    enum: ['win', 'loss', 'pending'],
    default: ['pending']
  },
  participants: Array,
  pick: Array,
  winners: Array,
  discipline: String,
  website: String
})

/**
 * Statics
 */
BetSchema.statics = {
  /**
   * List bets in descending order of 'date' timestamp.
   * @param {number} skip - Number of bets to be skipped.
   * @param {number} limit - Limit number of bets to be returned.
   * @returns {Promise<Bet[]>}
   */
  list ({skip = 0, limit = 50, user = ''} = {}) {
    if (user !== '') {
      return this.find({
        _owner: user
      })
        .sort({ date: 'desc' })
        .skip(+skip)
        .limit(+limit)
        .exec()
    }

    return this.find()
      .sort({ date: 'asc' })
      .skip(+skip)
      .limit(+limit)
      .exec()
  },

  update (bet) {
    return this.findOne({ id: bet.id }, function (err, oldBet){
      if (oldBet) {
        console.log('FOUND')
        console.log(oldBet)
        oldBet.date = bet.date
        oldBet.type = bet.type
        oldBet.odds = bet.odds
        oldBet.stake = bet.stake
        oldBet.currency = bet.currency
        oldBet.participants = bet.participants
        oldBet.pick = bet.pick
        oldBet.winners = bet.winners
        oldBet.discipline = bet.discipline
        oldBet.website = bet.website

        oldBet.save()
        return '1'
      }

      return Promise.reject(err)
    })
  },
  get (id) {
    console.log('IN')
    console.log(id)
    return this.find({
      id: id
    })
      .exec()
      .then((bet) => {
        if (bet) {
          return bet
        }
        const err = new APIError('No such bet exists!', httpStatus.NOT_FOUND)
        return Promise.reject(err)
      })
  }
}

/**
 * @typedef User
 */
export default mongoose.model('Bet', BetSchema)
