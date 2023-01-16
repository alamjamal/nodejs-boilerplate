const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');
const createError = require('http-errors')



dotenv.config({ path: path.join(__dirname, '/etc/secrets/.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    SERVER_PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    ACCESS_TOKEN_SECRET: Joi.string().required().description('JWT secret key'),
    REFRESH_TOKEN_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which verify email token expires'),
    MAIL_HOST: Joi.string().description('server that will send the emails'),
    MAIL_PORT: Joi.number().description('port to connect to the email server'),
    MAIL_SECURE: Joi.boolean().description('wether secure or not'),
    MAIL_USERNAME: Joi.string().description('username for email server'),
    MAIL_PASSWORD: Joi.string().description('password for email server'),
    MAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
    LOG_DIRECTORY: Joi.string().description('Log directory'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  serverUrl:envVars.SERVER_URL,
  server:{
    port:envVars.SERVER_PORT,
  },
  mongodb: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : '')
  },
  jwt: {
    accessTokenSecret: envVars.ACCESS_TOKEN_SECRET,
    refreshTokenSecret: envVars.ACCESS_TOKEN_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  email: {
    smtp: {
      host: envVars.MAIL_HOST,
      port: envVars.MAIL_PORT,
      secure:envVars.MAIL_SECURE,
      auth: {
        user: envVars.MAIL_USERNAME,
        pass: envVars.MAIL_PASSWORD,
      },
    },
    from: envVars.MAIL_FROM,
  },

  logDirectory:envVars.LOG_DIRECTORY
};