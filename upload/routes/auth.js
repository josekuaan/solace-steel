const express = require("express");

const {
  getUsers,
  getSingleUser,
  login,
  register,
  getMe,
  logout,
  updateUserDetails,
  resetPassword,
  forgotPassword,
  deleteUser,
} = require("../controller/auth");
const { protect, authorize } = require("../middleWare/auth");

const Router = express.Router();

Router.route("/register").post(register);
Router.route("/login").post(login);
Router.route("/forgot-password").post(forgotPassword);
Router.get("/logout", protect, logout);
Router.get("/get-users", protect, getUsers);
Router.get("/get-user/:id", protect, getSingleUser);
Router.get("/getMe/:id", protect, getMe);

Router.put("/update-user/:id", protect, authorize("admin"), updateUserDetails);
Router.delete("/delete-user/:id", protect, authorize("admin"), deleteUser);
Router.put("/reset-password/:id", resetPassword);

module.exports = Router;
