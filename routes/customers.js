const express = require("express");
const {
  customer,
  updateCustomers,
  deleteCustomer,
} = require("../controller/customer");
const { protect, authorize } = require("../middleWare/auth");
const Router = express.Router();

Router.route("/get-customers").get(protect, customer);
Router.route("/update-customer/:id").put(
  protect,
  authorize("admin"),
  updateCustomers
);
Router.route("/delete-customer/:id").delete(
  protect,
  authorize("admin"),
  deleteCustomer
);

module.exports = Router;
