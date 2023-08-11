const express = require("express");

const {
  getSubCategory,
  getAllInventory,
  createCategory,
  createInventory,
  checkout,
  ReturnInventory,
  getAllSales,
  getSingleSale,
  getAllCategory,
  getSaleId,
  getSaleByUser,
  getSingleInventory,
  getAllWeekMonth,
  getAllQty,
  getReturns,
  getRestock,
  getSingleReturn,
  getSingleRestock,
  updateSale,
  updateInventory,
  updateCategory,
  updateCategoryType,
  updateReturn,
  updateRestock,
  deleteSale,
  deleteCategory,
  deleteCategoryType,
  deleteInventory,
  deleteReturns,
  deleteRestock,
} = require("../controller/inventory");
const { protect, authorize } = require("../middleWare/auth");
console.log("got here");
const Router = express.Router();

Router.route("/get-sub-category").post(protect, getSubCategory);
Router.route("/create-category").post(
  protect,
  authorize("admin"),
  createCategory
);
Router.route("/create-inventory").post(
  protect,
  authorize("admin"),
  createInventory
);
Router.route("/return-inventory").post(
  protect,
  authorize("admin"),
  ReturnInventory
);
Router.route("/checkout").post(protect, checkout);
Router.route("/get-sales").get(protect, getAllSales);
Router.route("/get-qty").get(protect, getAllQty);
Router.route("/get-returns").get(protect, getReturns);
Router.route("/get-single-return/:id").get(protect, getSingleReturn);
Router.route("/get-single-restock/:id").get(protect, getSingleRestock);
Router.route("/get-sales-by-day-week-month-year").get(protect, getAllWeekMonth);
Router.route("/get-sales-by-user/:id").get(protect, getSaleByUser);
Router.route("/get-single-user-sale/:value").get(protect, getSingleSale);
Router.route("/get-sale-id/:id").get(protect, getSaleId);
Router.route("/get-single-inventory/:id").get(
  protect,

  getSingleInventory
);
Router.route("/get-categories").get(protect, getAllCategory);
Router.route("/get-restock").get(protect, getRestock);
Router.route("/get-inventories").get(protect, getAllInventory);
Router.route("/update-inventory/:id").put(
  protect,
  authorize("admin"),
  updateInventory
);
Router.route("/update-category/:id").put(
  protect,
  authorize("admin"),
  updateCategory
);
Router.route("/update-category-type").put(
  protect,
  authorize("admin"),
  updateCategoryType
);
Router.route("/update-sale/:id").put(protect, authorize("admin"), updateSale);
Router.route("/update-return/:id").put(
  protect,
  authorize("admin"),
  updateReturn
);
Router.route("/update-restock/:id").put(
  protect,
  authorize("admin"),
  updateRestock
);

Router.delete(
  "/delete-user-inventory/:id",
  protect,
  authorize("admin"),
  deleteInventory
);
Router.delete(
  "/delete-category/:id",
  protect,
  authorize("admin"),
  deleteCategory
);
Router.delete(
  "/delete-category-type",
  protect,
  authorize("admin"),
  deleteCategoryType
);
Router.delete("/delete-user-sale/:id", protect, authorize("admin"), deleteSale);
Router.delete(
  "/delete-user-returns/:id",
  protect,
  authorize("admin"),
  deleteReturns
);
Router.delete(
  "/delete-user-restock/:id",
  protect,
  authorize("admin"),
  deleteRestock
);

module.exports = Router;
