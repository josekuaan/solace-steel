const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  shop: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: ["Your email is required", true],
    trim: true,
    unique: true,
    match: [
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
      "please provide a valid email",
    ],
  },
  role: {
    type: String,
    required: true,
    enum: ["user", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: true,
    trim: true,
    select: false,
    minlength: 6,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    trim: true,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// Encrpt password before save
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// get signin token
UserSchema.methods.getsignedinToken = async function (next) {
  console.log(process.env.JWT_SECRETE);
  return await jwt.sign({ id: this._id }, process.env.JWT_SECRETE, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};
// Compare password

UserSchema.methods.comparePassword = async function (psw) {
  console.log(psw);
  return await bcrypt.compare(psw, this.password);
};

//Generate and hash password token
UserSchema.methods.getResetPasswordToken = async function () {
  //Generate token
  const resetToken = await crypto.randomBytes(20).toString("hex");
  // console.log('kokoko',resetToken)

  //hash token and set to resetpasswordToken
  this.resetPasswordToken = await crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  //Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

UserSchema.pre("save", function (next) {
  this.updated = Date.now();
  return next();
});

// UserSchema.virtual("investment",{
//     ref:'investment',
//     localField:'_id',
//     foreignField:'userId',
//     justOne:false
// })
module.exports = mongoose.model("user", UserSchema);
