const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON } = require('./plugin');
const {Agency} = require('./agency.model')

const clientSchema = mongoose.Schema(
  {
    agencyId:{ 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Agency'
  },
    name: {type: String,required: true,trim: true,},
    email: {type: String,required: true, trim: true, lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }},
    },
    phoneNumber:{type: String,required: true,trim: true,length:10},
    totalBill:{type:Number, required: true},
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
clientSchema.plugin(toJSON);


clientSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};


clientSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

clientSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});


const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
