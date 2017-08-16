import Bet from '../models/bet.model'
import httpStatus from 'http-status'
import APIError from '../helpers/APIError'
/**
 * Load bet and append to req.
 */
function load(req, res, next, id) {
  Bet.get(id)
    .then((bet) => {
      req.bet = bet; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get bet
 * @returns {Bet}
 */
function get(req, res) {
  return res.json(req.bet)
}

/**
 * Store new bet
 */
function create(req, res, next) {
  const bet = new Bet({
    id: req.body.id,
    _owner: req.body._owner,
    date: req.body.date,
    type: req.body.type,
    odds: req.body.odds,
    stake: req.body.stake,
    currency: req.body.currency,
    status: req.body.status,
    participants: req.body.participants,
    pick: req.body.pick,
    winners: req.body.winners,
    discipline: req.body.discipline,
    website: req.body.website,
  });

  bet.save()
    .then(savedBet => res.json(savedBet))
    .catch(e => next(e));
}

/**
 * Update existing bet
 */
 // TODO
function update(req, res, next) {
  const bet = req.bet;
  bet.status = req.body.status;

  bet.save()
    .then(savedBet => res.json(savedBet))
    .catch(e => next(e));
}

/**
 * Get bet list.
 * @property {number} req.query.skip - Number of bets to be skipped.
 * @property {number} req.query.limit - Limit number of bets to be returned.
 * @returns {Bet[]}
 */
function list(req, res, next) {
  const username = req.body.userid
  const { limit = 500, skip = 0, user = username } = req.query;
  Bet.list({ limit, skip })
    .then(bets => res.json(bets))
    .catch(e => next(e));
}

/**
 * Delete bet.
 * @returns {Bet}
 */
function remove(req, res, next) {
  const bet = req.body.bet
  Bet.find({
    id: bet.id,
    _owner: bet.userid
  }, function (err, bet) {
      // TODO security or smt
      if (err) {
          const error = new APIError('Authentication error: ' + err, httpStatus.INTERNAL_SERVER_ERROR, true)
          return next(error)
      }

      if (bet[0]) {
          bet[0].remove()
              .then(deletedBet => res.json(deletedBet))
              .catch(e => next(e))
      } else {
          const error = new APIError('Authentication error: Password is wrong', httpStatus.UNAUTHORIZED, true)
          return next(error)
      }
  })
}

export default { load, get, create, update, list, remove };
