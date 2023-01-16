const createError = require('http-errors')
const { validateAgency , validateClient} = require('../validation/agency.validate')
const { Agency, Client } = require('../model');
const bcrypt = require("bcryptjs");
const {sendWelcomeEmail} = require('../_helper/sendEmail')
const {setValue, getValue,  redisClient} = require('../_helper/init_redis')

// const pick = require('../_helper/pick');
const catchAsync = require('../_helper/catchAsync');

const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require('../_helper/jwt_helper')




const createAgency = catchAsync(async (req, res) => {
  const { error } = await validateAgency(req.body, req.method)
  if (error) throw createError.BadRequest(error.message)
  let {agency, client}  = req.body
  if (agency){
      agency =  await Agency.findOneAndUpdate({email:agency.email},{...agency}, {upsert:true, new:true, setDefaultsOnInsert: true})
      await sendWelcomeEmail(agency.email)
    }
    
  if (client){
   client =  await Client.findOneAndUpdate({email:client.email},{agencyId:agency?agency._id:client.agencyId,...client}, {upsert:true, new:true, setDefaultsOnInsert: true})
  }

  res.send({ agency, client })
});

const updateClient = catchAsync(async (req, res) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) throw createError.BadRequest('Not A Valid Id')
  const { error } = await validateClient(req.body, req.method)
  if (error) throw createError.BadRequest(error.message)
  const client = await Client.findByIdAndUpdate(req.params.id, {...req.body}, { new: true })
  if(!client) throw createError.BadRequest('Client Not Found')
  res.send(client)
});


const getAgency = catchAsync(async (req, res) => {
  const {top} = req.query
  const agency = await Client.find({}).sort({totalBill : -1}).limit(parseInt(top)).select('name totalBill')
  .populate({ path: "agencyId", select: "name" })
  const result = agency.map((item)=>{return {agencyName:item.agencyId?.name, clientName:item.name, totalBill:item.totalBill}})
  res.send(result)
});


const login = catchAsync(async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) throw createError.BadRequest()
  const agency = await Agency.findOne({ email: email })
  // const isMatch =zwait agency.isPasswordMatch(req.body.pasword);
  if (agency && bcrypt.compareSync(password, agency.password)) {
    const accessToken = await signAccessToken(agency.id)
    const refreshToken = await signRefreshToken(agency.id)
    res.send({ accessToken, refreshToken })
  } else {
    throw createError.Unauthorized('Username/password not valid')
  }
});



const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.body
  if (!refreshToken) throw createError.BadRequest()
  const userId = await verifyRefreshToken(refreshToken)
  const accessToken = await signAccessToken(userId)
  const refToken = await signRefreshToken(userId)
  res.send({ accessToken: accessToken, refreshToken: refToken })

});

const Test = catchAsync(async (req, res) => {

});


const logOut = catchAsync(async (req, res) => {
  const { refreshToken } = req.body
  if (!refreshToken) throw createError.BadRequest()
  const userId = await verifyRefreshToken(refreshToken)
  result = await redisClient.DEL(userId)
  res.send({message:"Log Out SuccessFully"})
});





module.exports = {
  createAgency,
  getAgency,
  login,
  refreshToken,
  logOut,
  updateClient

};
