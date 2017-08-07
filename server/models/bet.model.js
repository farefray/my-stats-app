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
    type: Date
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
  list({skip = 0, limit = 50, user = ''} = {}) {
    if (user !== '') {
      return this.find({
        _owner: user
      })
        .sort({date: -1})
        .skip(+skip)
        .limit(+limit)
        .exec()
    }

  return this.find()
    .sort({date: -1})
    .skip(+skip)
    .limit(+limit)
    .exec()
  }
}


/**
 * @typedef User
 */
export default mongoose.model('Bet', BetSchema)
