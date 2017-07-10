import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import config from '../../config/config';
import User from '../models/user.model';

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function login(req, res, next) {
  User.find({
    username: req.body.username
  }, function(err, user) {
    if (err) {
      const error = new APIError('Authentication error: ' + err, httpStatus.UNAUTHORIZED, true);
      return next(error);
    }

    if (user[0] && user[0].authenticate(req.body.password)) {
      const token = jwt.sign({
        username: user[0].username
      }, config.jwtSecret);
      return res.json({
        token,
        username: user[0].username
      });
    } else {
      const error = new APIError('Authentication error: Password is wrong', httpStatus.UNAUTHORIZED, true);
      return next(error);
    }
  });
}

/**
 * This is a protected route. Will return random number only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
function getRandomNumber(req, res) {
  // req.user is assigned by jwt middleware if valid token is provided
  return res.json({
    user: req.user,
    num: Math.random() * 100
  });
}

export default { login, getRandomNumber };
