const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON } = require('./plugin');



const agencySchema = mongoose.Schema(
  {
    // roles: {type: String, enum : ['agency','client'],required: true},
    // agency: {
	// 	type: Schema.Types.ObjectId,
	// 	ref: agency,
	// },

    name: {type: String,required: true,trim: true,},
    email: {type: String,required: true,unique: true, trim: true, lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }},
    },
    password: {type: String,required: true,trim: true, minlength: 4, 
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }},
        private: true, 
    },
    address: {
        address1:{type: String,required: true,trim: true,},
        address2:{type: String,trim: true,},
        city:{type: String,required: true,trim: true,},
        state:{type: String,required: true,trim: true,},
        phoneNumber:{type: String,required: true,trim: true,length:10},
	},
   
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
agencySchema.plugin(toJSON);


agencySchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};


agencySchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

agencySchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});


const Agency = mongoose.model('Agency', agencySchema);

module.exports = Agency;
