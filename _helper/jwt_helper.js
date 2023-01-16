const JWT = require('jsonwebtoken')
const createError = require('http-errors')
const { setValue, getValue, redisClient } = require('./init_redis')
const config = require('./config');
const path = require('path');
const fs = require('fs');

// (async()=>{
//   await redisClient.set('no', 'jamal')
// })()

const signOptions = {
  issuer: "SLMS",
  subject: "alam@alamjamal.ml",
  audience: "alamjamal",
  algorithm: "RS256"
};


const signAccessToken = async (userId) => {
  return new Promise((resolve, reject) => {
    try {
      const payload = { id: userId };
      const privateKey = fs.readFileSync(path.join(__dirname, '../secret/private.pem'), 'utf-8');
      const token = JWT.sign(payload, privateKey, { ...signOptions, expiresIn: "10d" });
      resolve(token);
    } catch (error) {
      reject(error)
    }

  })

};


const signRefreshToken = async (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const payload = { id: userId };
      const privateKey = fs.readFileSync(path.join(__dirname, '../secret/private.pem'), 'utf-8');
      const token = JWT.sign(payload, privateKey, { ...signOptions, expiresIn: "30d" });
      await redisClient.SET(userId, token)
      await redisClient.expire(userId, 30*24*60*60)
      resolve(token);
    } catch (error) {
      reject(error)
    }

  })
};


const verifyAccessToken = async (req, res, next) => {
  try {

    if (!req.headers['authorization']) return next(createError.Unauthorized())
    const authHeader = req.headers['authorization']
    const bearerToken = authHeader.split(' ')
    const token = bearerToken[1]
    const public = fs.readFileSync(path.join(__dirname, '../secret/public.pem'), 'utf-8');
    const tokenDetails = JWT.verify(token, public, {signOptions });
    req.user = tokenDetails;
    
    // const result = await redisClient.GET('BL' + req.user.id.toString())
    // console.log(result);
    // if (token !== result) throw new Error("Token Blacklisted....")
    next();
  } catch (err) {
    const message =
      err.name === 'JsonWebTokenError' ? 'Unauthorized Access' : err.message
    return next(createError.Unauthorized(message))

  }
}

const verifyRefreshToken = (refreshToken) => {
  return new Promise(async (resolve, reject) => {
    const public = fs.readFileSync(path.join(__dirname, '../secret/public.pem'), 'utf-8');
    const tokenDetails = JWT.verify(refreshToken, public, {signOptions });
    const user = tokenDetails
    const result = await redisClient.GET(user.id)
    if (refreshToken === result) return resolve(user.id)
    reject(createError.Unauthorized())
  })
}


module.exports = { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken }