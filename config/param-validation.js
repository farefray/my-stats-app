import Joi from 'joi';

export default {
  // POST /api/bets
  storeBet: {
    body: {
      id: Joi.string().required()
    }
  },

  // POST /api/users
  createUser: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().required()
    }
  },

  // UPDATE /api/bets/:betId
  updateBet: {
    body: {
      id: Joi.string().required()
    },
    params: {
      betId: Joi.string().hex().required()
    }
  },

  // UPDATE /api/users/:userId
  updateUser: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().required()
    },
    params: {
      userId: Joi.string().hex().required()
    }
  },

  // POST /api/auth/login
  login: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().required()
    }
  }
};
