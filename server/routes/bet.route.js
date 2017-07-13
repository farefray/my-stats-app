import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import betCtrl from '../controllers/bet.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/bets - Get list of bets */
  .get(betCtrl.list)

  /** POST /api/bets - Store new bet */
  .post(validate(paramValidation.storeBet), betCtrl.create);

router.route('/:betId')
  /** GET /api/bets/:betId - Get bet */
  .get(betCtrl.get)

  /** PUT /api/bets/:betId - Update user */
  .put(validate(paramValidation.updateBet), betCtrl.update)

  /** DELETE /api/bets/:betId - Delete user */
  .delete(betCtrl.remove);

/** Load user when API with betId route parameter is hit */
router.param('betId', betCtrl.load);

export default router;
