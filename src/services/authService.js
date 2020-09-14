const crypto = require('crypto');
const status = require('http-status');
const ApiError = require('../helpers/apiError');
const MAILER = require('../mailer');
const { User } = require('../models');
const { bcryptPassword } = require('./password');

const authService = {
  async createUser(user, done) {
    const userData = user;
    const userDetail = await User.createInstance(userData);

    await MAILER.sendMail(userData, 'register', 'Registration', (info, err) => {
      if (err) {
        const newError = new ApiError(err.message, status.BAD_REQUEST);
        done(null, newError);
      } else {
        done(userDetail, false);
      }
    });
  },
  async forgotPassword(userObj, done) {
    const user = userObj;
    const params = {};
    params.resetPasswordToken = await crypto.randomBytes(64).toString('hex');
    const userData = await user.updateInstance(user.id, params);

    MAILER.sendMail(user, 'forgotPassword', 'Forgot Password', (info, err) => {
      if (err) {
        const newError = new ApiError(err.message, status.BAD_REQUEST);
        done(null, newError);
      } else {
        done(userData, false);
      }
    });
  },
  async resetPassword(user, params, done) {
    try {
      let { password } = params;
      await bcryptPassword(password, (encPassword) => {
        password = encPassword;
      });
      const userParams = {
        password,
        resetPasswordToken: null,
        secret: null,
      };
      await user.updateInstance(user.id, userParams);
      done(true, false);
    } catch (error) {
      done(true, error);
    }
  },
};

module.exports = authService;
