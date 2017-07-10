import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import crypto from 'crypto';

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  hashed_password: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

/**
 * Add your
 * - pre-save hooks
 * - validations (hangled by joi in controller)
 * - virtuals
 */


/**
 * Methods
 */
UserSchema.methods.makeSalt = function() {
   return Math.round((new Date().valueOf() * Math.random())) + ''
}
UserSchema.methods.encryptPassword = function (password) {
  if (!password) return ''
  return crypto.createHmac('sha1', this.salt !== undefined ? this.salt : '').update(password).digest('hex')
}

UserSchema.methods.authenticate = function(plainText) {
  return this.encryptPassword(plainText) === this.hashed_password
}


/**
 * Statics
 */
UserSchema.statics = {
  login (username, password, cb) {
    this.findOne({
      username: username
    }, function (err, user) {
      if (err || !user) {
        if (err) {
          console.log(err);
        }

        return cb(err, {
          code: -1,
          msg : username + ' is not exist!'
        });
      }

      if(this.encryptPassword(password) !== user.hashed_password) {
        console.log(error);
        return cb(err, {
          code: -2,
          msg : 'password is incorrect, please check it again!'
        });
      }

      return cb(null, user);
    });
  },

  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((user) => {
        if (user) {
          return user;
        }
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List users in descending order of 'created' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ created: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};

UserSchema.virtual('password')
  .set(function(password) {
    this._password = password
    this.salt = this.makeSalt()
    this.hashed_password = this.encryptPassword(password)
  })
  .get(function() {
    return this._password
  })
/**
 * @typedef User
 */
export default mongoose.model('User', UserSchema);
