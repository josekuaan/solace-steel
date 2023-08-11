// const asyncHandler = require("../middleWare/async")
const crypto = require("crypto");
const path = require("path");
const recoveryUS = require("../Model/recoveryUS");

const User = require("../Model/user");

exports.getUsers = async (req, res, next) => {
  const user = await User.find();
  if (!user)
    return res.status(400).json({ success: false, msg: "user not found" });
  //If the user is not an admin, they can only add one bootcamp
  if (req.user.role !== "admin") {
    return res
      .status(400)
      .json({ success: false, msg: "You are not An Administrator" });
  }
  // console.log(user)

  return res.status(200).json({ success: true, msg: user });
  next();
};

exports.getSingleUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user)
    return res.status(400).json({ success: false, msg: "user not found" });
  //If the user is not an admin, they can only add one bootcamp
  if (req.user.role !== "admin") {
    return res
      .status(400)
      .json({ success: false, msg: "You are not An Administrator" });
  }
  // console.log(user)

  return res.status(200).json({ success: true, msg: user });
  next();
};

//@desc    Register user
//@route   POST /api/v1/auth/users
//@access  Private/admin
exports.register = async (req, res) => {
  let user = await User.findOne({ email: req.body.email });

  if (user)
    return res
      .status(400)
      .json({ success: false, msg: "User with this email already exist" });
  user = await User.findOne({ shop: req.body.shop });
  if (user)
    return res
      .status(400)
      .json({ success: false, msg: "This Shop already exist" });

  user = await User.create(req.body);
  sendTokenResponse(user, 200, res);
};

//@desc    Login user
//@route   POST /api/v1/auth/users
//@access  Private/admin
exports.login = async (req, res) => {
  const { password, email } = req.body;

  // Validate email and padssword
  if (!email || !password) {
    res
      .status(400)
      .json({ success: false, msg: "Please provide email and password" });
  }

  const user = await User.findOne({ email }).select("+password");

  if (user == null)
    return res
      .status(400)
      .json({ success: false, msg: "No such user Exist in our Database" });

  // if (!user)
  //   return res
  //     .status(400)
  //     .json({ success: false, msg: "Incorrect credentials" });

  const isMatch = await user.comparePassword(password);

  if (!isMatch)
    return res.status(400).json({ success: false, msg: "Incorrect Password" });
  sendTokenResponse(user, 200, res);
};

async function sendTokenResponse(user, statusCode, res) {
  const token = await user.getsignedinToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  return res.status(statusCode).json({ success: true, token, user });
}

//@desc    Get currently login user
//@route   Get /api/v1/auth/getme
//@access  Private

exports.getMe = async (req, res, next) => {
  // console.log(req.user)

  let user = await User.findById(req.user._id);

  if (!user)
    return res.status(400).json({ success: false, msg: "user not found" });

  res.status(200).json({ success: true, msg: user });
  next();
};

//@desc    Logout user
//@route   Get /api/v1/auth/logout
//@access  Private
exports.logout = async (req, res, next) => {
  return res
    .status(200)
    .cookie("token", "none", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    })
    .json({ success: true, msg: {} });
  next();
};

//@desc    Update user
//@route   PUT /api/auth/updateDetails/:id
//@access  Private

exports.updateUserDetails = async (req, res, next) => {
  if (req.body.password === "") {
    const user = await User.findById(req.params.id);

    if (!user)
      return res.status(400).json({ success: false, msg: "user not found" });
    //If the user is not an admin, they can only add one bootcamp
    if (req.user.role !== "admin") {
      return res
        .status(400)
        .json({ success: false, msg: "You are not An Administrator" });
    }

    let insert = {
      email: req.body.email,
      fullName: req.body.fullName,
    };
    const msg = await User.findByIdAndUpdate(req.params.id, insert, {
      new: true,
      runValidators: true,
    });

    if (!msg) return res.status(400).json({ msg: "user not found" });
    return res.status(200).json({ success: true, msg });
  } else {
    const user = await User.findOne({ email: req.body.email }).select(
      "+password"
    );
    if (!user)
      return res.status(404).json({ success: false, msg: "user not found" });

    // console.log(user)
    //Get reset token
    const getResetToken = await user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    changePassword(req, res, getResetToken);
    // try {
    //   res
    //     .status(200)
    //     .json({
    //       success: true,
    //       data: "You have five minutes to change the password",
    //     });
    // } catch (err) {
    //   user.resetPasswordToken = undefined;
    //   user.resetPasswordExpire = undefined;

    //   user.save({ validateBeforeSave: false });

    //   return res
    //     .status(500)
    //     .json({ success: false, data: "Email could not be sent" });
    // }
  }
};

const changePassword = async (req, res, reset) => {
  let resetPasswordToken = await crypto
    .createHash("sha256")
    .update(reset)
    .digest("hex");
  let user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user)
    return res.status(400).json({
      success: false,
      msg: "The time given to you has expired please try again",
    });

  //Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  //save user new password
  user.save({ validateBeforeSave: false });
  console.log(user);
  if (user) {
    return res.status(200).json({
      success: true,
      password: true,
      msg: `Password changed succefully`,
    });
  }
};

//@desc    Delete a user
//@route   DELETE /api/v1/bootcamp/:id
//@access  Private
exports.deleteUser = async (req, res, next) => {
  let user = await User.findById(req.params.id);

  if (!user)
    return res.status(200).json({
      success: true,
      msg: `user with id of ${req.params.id} not found`,
    });
  user = await user.remove();
  await recoveryUS.create(user);
  return res.status(200).json({ success: true, msg: {} });
};

//@desc    Reset password
//@route   PUT /api/auth/resetPassword/:resettoken
//@access  Public

exports.resetPassword = async (req, res, next) => {
  let resetPasswordToken = await crypto
    .createHash("sha256")
    .update(req.params.id)
    .digest("hex");
  let user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user)
    return res.status(400).json({ success: false, msg: "Expied Token" });

  //Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  //save user new password
  user.save({ validateBeforeSave: false });
  console.log(user);
  if (user) {
    return res
      .status(200)
      .json({ success: true, msg: `Password changed succefully` });
  }
};

//@desc    Post forgot password
//@route   POST /api/v1/auth/forgotpassword
//@access  Private
exports.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email }).select(
    "+password"
  );
  if (!user)
    return res.status(404).json({ success: false, msg: "user not found" });

  // console.log(user)
  //Get reset token
  const getResetToken = await user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  //Create reset url

  const resetUrl = `https://solacesteel.com/reset-password/${getResetToken}`;

  const message = `You are recieving this email because you (or someone else) has requested for a change of password.
    Please click the url to reset your password \n\n ${resetUrl}`;
  // console.log('========',message);

  try {
    sendEmail({
      email: user.email,
      subject: "Password reset token",
      message: message,
      res,
    });

    res.status(200).json({ success: true, data: "Email sent" });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    user.save({ validateBeforeSave: false });

    return res
      .status(500)
      .json({ success: false, data: "Email could not be sent" });
  }
};
