const { Router } = require('express');
const { validate } = require('express-validation');
const { AuthController } = require('../controllers');
const { authValidation } = require('../validations');

const authRoute = {
  get router() {
    const router = Router();
    router.post(
      '/register',
      validate(authValidation.register, { keyByField: true }, { abortEarly: false }),
      AuthController.register,
    );
    router.post(
      '/login',
      validate(authValidation.login, { keyByField: true }, { abortEarly: false }),
      AuthController.login,
    );
    router.post(
      '/forgot_password',
      validate(authValidation.forgotPassword, { keyByField: true }, { abortEarly: false }),
      AuthController.forgotPassword,
    );
    router.post(
      '/reset_password_email/:reset_password_token',
      validate(authValidation.resetPasswordEmail, { keyByField: true }, { abortEarly: false }),
      AuthController.resetPasswordByEmail,
    );
    router.post(
      '/verify_email/:registration_token',
      validate(authValidation.verifyByEmail, { keyByField: true }, { abortEarly: false }),
      AuthController.verifyRegisteredUserEmail,
    );

    return router;
  },
};

module.exports = authRoute;
