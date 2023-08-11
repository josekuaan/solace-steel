const Inventory = require("../Model/inventory");
const Category = require("../Model/category");
const Sale = require("../Model/sales");
const moment = require("moment");
const User = require("../Model/user");
const Return = require("../Model/Return");
const Restocking = require("../Model/Restocking");
const RecoveryRS = require("../Model/recoveryRS");
const RecoveryRT = require("../Model/recoveryRT");
const RecoverySA = require("../Model/recoverySA");
const RecoveryUS = require("../Model/recoveryUS");
const RecoveryCT = require("../Model/recoveryCT");
const RecoveryIN = require("../Model/recoveryIN");

//@desc    Get all user
//@route   GET /api/v1/auth/users
//@access  Private/admin
exports.getAllCategory = async (req, res) => {
  const categories = await Category.find();

  if (!categories)
    return res.status(401).json({ success: false, msg: `No record Found` });
  res.status(200).json({ success: true, categories });
};
//@desc    Get all user
//@route   GET /api/v1/auth/users
//@access  Private/admin
exports.getAllWeekMonth = async (req, res) => {
  const LIMIT = 10;

  const { page } = req.query;
  // console.log(pageNumber.page);
  const startIndex = (Number(page) - 1) * LIMIT;

  let week = await Sale.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(
            moment().startOf("week").toDate() + 2 * 24 * 60 * 60 * 1000
          ),
          // $lt: moment().day("week").toDate(),
        },
      },
    },
    {
      $project: {
        dayOfWeek: { $dayOfWeek: "$createdAt" },

        totalAmount: { $sum: { $multiply: ["$prize", "$convertedqty"] } },
        qty: {
          $sum: "$qty",
        },
        type: "$type",
        prize: "$prize",
        category: "$category",
        payment: "$payment",
        shop: "$shop",
        convertedqty: "$convertedqty",
        date: "$createdAt",
        userId: "$userId",
        _id: "$_id",
      },
    },
  ])
    .sort({ _id: -1 })
    .limit(LIMIT)
    .skip(startIndex);
  let day = await Sale.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(new Date().setHours(00, 00, 00, 00)),
        },
      },
    },
    {
      $project: {
        totalAmount: { $sum: { $multiply: ["$prize", "$convertedqty"] } },
        qty: {
          $sum: "$qty",
        },
        type: "$type",
        prize: "$prize",
        category: "$category",
        payment: "$payment",
        shop: "$shop",
        convertedqty: "$convertedqty",
        date: "$createdAt",
        userId: "$userId",
        _id: "$_id",
      },
    },
  ])
    .sort({ _id: -1 })
    .limit(LIMIT)
    .skip(startIndex);

  let month = await Sale.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(moment().startOf("month").toDate()),
          // $lte: moment().day("week").toDate(),
        },
      },
    },
    {
      $project: {
        dayOfWeek: { $dayOfWeek: "$createdAt" },

        totalAmount: { $sum: { $multiply: ["$prize", "$convertedqty"] } },
        qty: {
          $sum: "$qty",
        },
        type: "$type",
        prize: "$prize",
        category: "$category",
        payment: "$payment",
        shop: "$shop",
        convertedqty: "$convertedqty",
        date: "$createdAt",
        userId: "$userId",
        _id: "$_id",
      },
    },
  ])
    .sort({ _id: -1 })
    .limit(LIMIT)
    .skip(startIndex);

  month.reverse();
  week.reverse();
  day.reverse();

  res.status(200).json({
    message: "sales",
    success: true,
    month,
    week,
    day,
    total: [
      {
        dayTotal: day.length,
        weekTotal: week.length,
        monthTotal: month.length,
      },
    ],
    currentPage: Number(page),
    numberOfPages: [
      {
        numberOfPageDay: Math.ceil(day.length / LIMIT),
        numberOfPageWeek: Math.ceil(week.length / LIMIT),
        numberOfPageMonth: Math.ceil(month.length / LIMIT),
      },
    ],
  });
};

//@desc    Get all user
//@route   GET /api/v1/auth/users
//@access  Private/admin
exports.getAllInventory = async (req, res) => {
  let inventory;
  let total;

  const LIMIT = 10;

  const { page } = req.query;
  // console.log(pageNumber.page);
  if (page) {
    const startIndex = (Number(page) - 1) * LIMIT;

    total = await Inventory.countDocuments();

    inventory = await Inventory.find()
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex);
  } else {
    inventory = await Inventory.find();
  }

  if (!inventory)
    return res.status(401).json({ success: false, msg: `No record Found` });
  inventory;

  res.status(200).json({
    success: true,
    message: "All created product.",
    inventory: inventory,

    total: total,
    currentPage: Number(page),
    numberOfPages: Math.ceil(total / LIMIT),
  });
};

//@desc    Get all user
//@route   GET /api/v1/auth/users
//@access  Private/admin
exports.getAllQty = async (req, res) => {
  const inventory = await Inventory.aggregate([
    { $match: { category: req.query.query } },
    {
      $group: {
        _id: "$shop",
        result: { $push: { qty: "$qty", type: "$type" } },
      },
    },
  ]);

  if (!inventory)
    return res.status(401).json({ success: false, msg: `No record Found` });
  res.status(200).json({ success: true, inventory });
};
//@desc    Get all user
//@route   GET /api/v1/auth/users
//@access  Private/admin
exports.getSingleInventory = async (req, res) => {
  const inventory = await Inventory.findById(req.params.id);

  if (!inventory)
    return res.status(401).json({ success: false, msg: `No record Found` });
  res.status(200).json({ success: true, inventory });
};
//@desc    Get all sale
//@route   GET /api/v1/auth/inventory/get-sales
//@access  Private/user
exports.getAllSales = async (req, res) => {
  let sale;
  let total;

  const LIMIT = 10;

  const { page } = req.query;

  const startIndex = (Number(page) - 1) * LIMIT;

  total = await Sale.countDocuments();

  sale = await Sale.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);

  if (!sale)
    return res.status(404).json({ success: false, msg: `No record Found` });
  sale;

  sale = sale.map((sal) => {
    obj = {};

    obj["qty"] = sal.qty;
    obj["category"] = sal.category;
    obj["type"] = sal.type;
    obj["prize"] = sal.prize;
    obj["payment"] = sal.payment;
    obj["detail"] = sal.detail;
    obj["amount"] = parseInt(sal.prize) * parseInt(sal.qty);
    obj["date"] = sal.createdAt;
    obj["id"] = sal._id;
    obj["userId"] = sal.userId;

    return obj;
  });

  res.status(200).json({
    success: true,
    message: "All sold Items.",
    sale,
    total: total,
    currentPage: Number(page),
    numberOfPages: Math.ceil(total / LIMIT),
  });
};
//@desc    Get all sale
//@route   GET /api/v1/auth/inventory/get-sales
//@access  Private/user
exports.getReturns = async (req, res) => {
  let returns;
  let total;

  const LIMIT = 10;

  const { page } = req.query;

  const startIndex = (Number(page) - 1) * LIMIT;

  total = await Return.countDocuments();

  returns = await Return.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);

  if (!returns)
    return res.status(404).json({ success: false, msg: `No record Found` });

  returns.reverse();
  res.status(200).json({
    success: true,
    message: "All returned Items.",
    returns,
    total: total,
    currentPage: Number(page),
    numberOfPages: Math.ceil(total / LIMIT),
  });
};
//@desc    Get all sale
//@route   GET /api/v1/auth/inventory/get-sales
//@access  Private/user
exports.getRestock = async (req, res) => {
  let restock;
  let total;

  const LIMIT = 10;

  const { page } = req.query;
  console.log(page);
  const startIndex = (Number(page) - 1) * LIMIT;

  total = await Restocking.countDocuments();

  restock = await Restocking.find()
    .sort({ _id: -1 })
    .limit(LIMIT)
    .skip(startIndex);
  // let restock = await Restocking.find();

  if (!restock)
    return res.status(401).json({ success: false, msg: `No record Found` });

  restock.reverse();

  res.status(200).json({
    message: "Restocking",
    success: true,
    restock,
    total: total,
    currentPage: Number(page),
    numberOfPages: Math.ceil(total / LIMIT),
  });
};
//@desc    Get singl sale
//@route   GET /api/v1/auth/inventory/get-single-user-sale/:id
//@access  Private/user
exports.getSingleSale = async (req, res) => {
  let sale = await Sale.find({ userId: req.params.value });

  if (!sale)
    return res.status(401).json({ success: false, msg: `No record Found` });
  sale = sale.map((sal) => {
    obj = {};

    obj["qty"] = sal.qty;
    obj["category"] = sal.category;
    obj["type"] = sal.type.charAt(0).toUpperCase() + sal.type.slice(1);
    obj["price"] = sal.prize;
    obj["amount"] = sal.prize * sal.qty;
    obj["date"] = sal.createdAt;
    obj["id"] = sal._id;

    return obj;
  });
  res.status(200).json({ success: true, sale });
};
//@desc    Get singl sale
//@route   GET /api/v1/auth/inventory/get-sales-by-user
//@access  Private/user
exports.getSaleByUser = async (req, res) => {
  let sale;
  let total;

  const LIMIT = 10;

  const { page } = req.query;

  const startIndex = (Number(page) - 1) * LIMIT;

  total = await Sale.countDocuments();

  sale = await Sale.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);
  // let sale = await Sale.aggregate([
  //   {
  //     $match: {
  //       createdAt: {
  //         $gte: new Date(moment().startOf("month").toDate()),
  //         // $lte: moment().day("week").toDate(),
  //       },
  //       userId: req.params.id,
  //     },
  //   },
  // ]);
  if (!sale)
    return res.status(401).json({ success: false, msg: `No record Found` });
  // sale.reverse();
  res.status(200).json({
    message: "Sales",
    success: true,
    sale,
    total: total,
    currentPage: Number(page),
    numberOfPages: Math.ceil(total / LIMIT),
  });
};
//@desc    Get singl sale
//@route   GET /api/v1/auth/inventory/get-single-user-sale/:id
//@access  Private/user
exports.getSaleId = async (req, res) => {
  let sale = await Sale.findById(req.params.id);

  if (!sale)
    return res.status(401).json({ success: false, msg: `No record Found` });

  res.status(200).json({ success: true, sale });
};
//@desc    Get singl sale
//@route   GET /api/v1/auth/inventory/get-single-return/:id
//@access  Private/user
exports.getSingleReturn = async (req, res) => {
  let inventory = await Return.findById(req.params.id);

  if (!inventory)
    return res.status(401).json({ success: false, msg: `No record Found` });

  res.status(200).json({ success: true, inventory });
};
//@desc    Get singl sale
//@route   GET /api/v1/auth/inventory/get-single-restock/:id
//@access  Private/user
exports.getSingleRestock = async (req, res) => {
  let restock = await Restocking.findById(req.params.id);

  if (!restock)
    return res.status(401).json({ success: false, msg: `No record Found` });

  res.status(200).json({ success: true, restock });
};

//@desc    Get Sub categories
//@route   GET /api/
//@access  Private/admin
exports.getSubCategory = async (req, res) => {
  const sub_categories = await Category.find(req.body);

  if (!sub_categories)
    return res.status(401).json({ success: false, msg: `No record` });

  res.status(200).json({ success: true, sub_categories: sub_categories });
};

//@desc   Submit category
//@route   POST /api/auth/inventory/create-category
//@access  Private/admin
exports.createCategory = async (req, res) => {
  const result = await Category.findOne({ category: req.body.category });

  if (result) {
    const category = await Category.findOneAndUpdate(
      { category: req.body.category },
      { $addToSet: { type: req.body.type } }
    );

    if (!category)
      return res.status(401).json({ success: false, msg: `No record` });

    res.status(200).json({ success: true, category });
  } else {
    const category = await Category.create(req.body);

    if (!category)
      return res.status(401).json({ success: false, msg: `No record` });
    res.status(200).json({ success: true, category });
  }
};

//@desc   Submit inventory
//@route   POST /api/auth/inventory/create-inventory
//@access  Private/admin
exports.createInventory = async (req, res) => {
  let inventory = await Inventory.find({
    shop: req.body.shop,
    type: req.body.type,
  });

  if (inventory.length !== 0) {
    for (var i = 0; i < inventory.length; i++) {
      inventory = await Inventory.findOneAndUpdate(
        { _id: inventory[i]._id },
        {
          qty: parseInt(inventory[i].qty) + parseInt(req.body.qty),
          prize: req.body.prize,
        },

        { new: true, runValidators: true }
      );
    }

    if (!inventory)
      return res.status(401).json({
        success: false,
        msg: `No record Created contact administrator `,
      });
    req.body.user = req.user.fullName;
    req.body.userId = req.user._id;
    await Restocking.create(req.body);
    let restock = await Restocking.find();
    res.status(200).json({ success: true, restock });
  } else {
    req.body.user = req.user.fullName;
    req.body.userId = req.user._id;
    inventory = await Inventory.create(req.body);

    if (!inventory)
      return res.status(401).json({ success: false, msg: `No record` });
    res.status(200).json({ success: true, inventory });
  }
};
//@desc   Submit inventory
//@route   POST /api/auth/inventory/return-inventory
//@access  Private/admin
exports.ReturnInventory = async (req, res) => {
  let inventory = await Inventory.find({
    shop: req.body.shop,
    type: req.body.type,
  });

  if (inventory.length !== 0) {
    for (var i = 0; i < inventory.length; i++) {
      inventory = await Inventory.findOneAndUpdate(
        { _id: inventory[i]._id },
        {
          qty: Number(inventory[i].qty) + Number(req.body.qty),
        },

        { new: true, runValidators: true }
      );
    }

    // console.log(inventory);
    if (!inventory)
      return res.status(401).json({ success: false, msg: `No record` });
    req.body.user = req.user.fullName;
    req.body.userId = req.user._id;
    inventory = await Return.create(req.body);

    inventory = await Return.find();

    res.status(200).json({ success: true, inventory });
  }
};

//@desc   Submit sales
//@route   POST /api/auth/inventory/chekout:id
//@access  Private/user
exports.checkout = async (req, res) => {
  req.body.user = req.user.fullName;
  req.body.userId = req.user._id;
  req.body.shop = req.user.shop;
  req.body.convertedqty = Number(req.body.qty) === 0.5 ? 1 : req.body.qty;

  const inventory = await Inventory.find({
    shop: req.body.shop,
    type: req.body.type,
  });

  if (inventory.length !== 0) {
    for (var i = 0; i < inventory.length; i++) {
      if (inventory[i].qty == 0) {
        return res.status(401).json({
          success: false,
          msg: `You have run of stock :).`,
        });
      }

      let inv = await Inventory.findOneAndUpdate(
        { _id: inventory[i]._id },
        { qty: inventory[i].qty - req.body.qty },
        { new: true, runValidators: true }
      );

      // console.log(inv);

      let sale = await Sale.create(req.body);

      res.status(200).json({ success: true, sale });
    }
  } else {
    return res.status(401).json({
      success: false,
      msg: `You can not sale this Item because it has not been created for your shop`,
    });
  }
};

//@desc    Get update user
//@route   GET /api/auth/updateUserInvest/:id
//@access  Private/admin
exports.updateSale = async (req, res) => {
  let sale = await Sale.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  console.log(sale);

  if (!sale)
    return res
      .status(401)
      .json({ success: false, msg: `Could not update this sales` });
  sale = await Sale.find();
  res.status(200).json({ success: true, sale });
};
//@desc    Get update user
//@route   GET /api/auth/updateReturn/:id
//@access  Private/admin
exports.updateReturn = async (req, res) => {
  console.log(req.body);

  let inventory = await Return.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  console.log(inventory);

  if (!inventory)
    return res
      .status(401)
      .json({ success: false, msg: `Could not update this sales` });
  res.status(200).json({ success: true, inventory });
};
//@desc    Get update user
//@route   GET /api/auth/updateReturn/:id
//@access  Private/admin
exports.updateRestock = async (req, res) => {
  // let inventory = await Inventory.find({
  //   shop: req.body.shop,
  //   type: req.body.type,
  // });

  // if (inventory.length !== 0) {
  //   for (var i = 0; i < inventory.length; i++) {
  //     inventory = await Inventory.findOneAndUpdate(
  //       { _id: inventory[i]._id },
  //       {
  //         qty: parseInt(inventory[i].qty) + parseInt(req.body.qty),
  //         prize: req.body.prize,
  //       },

  //       { new: true, runValidators: true }
  //     );
  //   }
  // }
  let restock = await Restocking.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  console.log(restock);

  if (!restock)
    return res
      .status(401)
      .json({ success: false, msg: `Could not update this sales` });
  res.status(200).json({ success: true, restock });
};

//@desc    Get update user
//@route   GET /api/auth/updateUserInvest/:id
//@access  Private/admin
exports.updateInventory = async (req, res) => {
  // req.body.createdAt = new Date(req.body.createdAt);
  // console.log(req.body);
  // return;
  let inventory = await Inventory.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!inventory)
    return res
      .status(401)
      .json({ success: false, msg: `Could not update account` });
  inventory = await Inventory.find();
  res.status(200).json({ success: true, inventory });
};
//@desc    Get update user
//@route   GET /api/auth/updateCategory?query={}
//@access  Private/admin
exports.updateCategoryType = async (req, res) => {
  console.log(req.query);
  var arr = [];
  let { category, type, correction } = req.query;
  // console.log(category, type);
  let result = await Category.find({ category });
  // console.log(result);
  for (let i = 0; i < result.length; i++) {
    arr = result[i].type.filter((item) => item !== type);

    arr.push(correction);
  }
  console.log(arr);

  if (arr) {
    const cate = await Category.findOneAndUpdate(
      { category: category },
      { type: arr },
      {
        new: true,
        runValidators: true,
      }
    );
    console.log("answer", cate);

    if (!cate)
      return res.status(401).json({ success: false, msg: `No record` });

    res.status(200).json({ success: true, cate });
  }
};
//@desc    Get update user
//@route   GET /api/auth/updateCategory/:id
//@access  Private/admin
exports.updateCategory = async (req, res) => {
  const cate = await Category.findByIdAndUpdate(
    req.params.id,
    { category: req.body.correction },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!cate) return res.status(401).json({ success: false, msg: `No record` });

  res.status(200).json({ success: true, cate });
};

//@desc    Delete a user
//@route   DELETE /api/v1/Investment/:id
//@access  Private
exports.deleteInventory = async (req, res, next) => {
  let invent = await Inventory.findById(req.params.id);

  if (!invent)
    return res.status(200).json({
      success: true,
      msg: `user with id of ${req.params.id} not found`,
    });
  invent = await invent.remove();
  let recovery = {
    createdDate: invent.createdAt,
    shop: invent.shop,
    category: invent.category,
    type: invent.type,
    qty: invent.qty,
  };
  await RecoveryIN.create(recovery);
  return res.status(200).json({ success: true, msg: {} });
};
//@desc    Delete a user
//@route   DELETE /api/v1/Investment/:id
//@access  Private
exports.deleteCategory = async (req, res, next) => {
  let category = await Category.findById(req.params.id);

  if (!category)
    return res.status(200).json({
      success: true,
      msg: `user with id of ${req.params.id} not found`,
    });
  category = await category.remove();
  let recovery = {
    createdDate: category.createdAt,
    category: category.category,
    type: category.type,
  };
  await RecoveryCT.create(recovery);
  return res.status(200).json({ success: true, msg: {} });
};
//@desc    Delete a user
//@route   DELETE /api/v1/Investment/:id
//@access  Private
exports.deleteCategoryType = async (req, res, next) => {
  console.log(req.query);

  var arr = [];
  let { category, type } = req.query;

  let result = await Category.find({ category });

  for (let i = 0; i < result.length; i++) {
    arr = result[i].type.filter((item) => item !== type);
  }

  if (arr) {
    const cate = await Category.findOneAndUpdate(
      { category: category },
      { type: arr },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!cate)
      return res.status(401).json({ success: false, msg: `No record` });
    // await RecoveryIN.create(invent)
    res.status(200).json({ success: true, cate });
  }
};

//@desc    Delete a user
//@route   DELETE /api/v1/Investment/:id
//@access  Private
exports.deleteSale = async (req, res, next) => {
  let sale = await Sale.findById(req.params.id);

  if (!sale)
    return res.status(200).json({
      success: true,
      msg: `user with id of ${req.params.id} not found`,
    });
  sale = await sale.remove();
  let inventory = await Inventory.find({
    shop: sale.shop,
    type: sale.type,
  });

  if (inventory.length !== 0) {
    for (var i = 0; i < inventory.length; i++) {
      inventory = await Inventory.findOneAndUpdate(
        { _id: inventory[i]._id },
        {
          qty: Number(inventory[i].qty) + Number(sale.qty),
        },

        { new: true, runValidators: true }
      );
      // console.log(inventory);
    }
  }
  let recovery = {
    createdDate: sale.createdAt,
    shop: sale.shop,
    category: sale.category,
    type: sale.type,
    qty: sale.qty,
    payment: sale.payment,
  };
  await RecoverySA.create(recovery);
  return res.status(200).json({ success: true, msg: {} });
};

//@desc    Delete a user
//@route   DELETE /api/v1/Investment/:id
//@access  Private
exports.deleteReturns = async (req, res, next) => {
  let returns = await Return.findById(req.params.id);

  if (!returns)
    return res.status(200).json({
      success: true,
      msg: `user with id of ${req.params.id} not found`,
    });
  returns = await returns.remove();

  let inventory = await Inventory.find({
    shop: returns.shop,
    type: returns.type,
  });

  if (inventory.length !== 0) {
    for (var i = 0; i < inventory.length; i++) {
      inventory = await Inventory.findOneAndUpdate(
        { _id: inventory[i]._id },
        {
          qty: parseInt(inventory[i].qty) - parseInt(returns.qty),
        },

        { new: true, runValidators: true }
      );
    }
  }
  let recovery = {
    createdDate: returns.createdAt,
    shop: returns.shop,
    category: returns.category,
    type: returns.type,
    qty: returns.qty,
  };
  await RecoveryRT.create(recovery);
  return res.status(200).json({ success: true, msg: {} });
};
//@desc    Delete a user
//@route   DELETE /api/v1/Investment/:id
//@access  Private
exports.deleteRestock = async (req, res, next) => {
  let restock = await Restocking.findById(req.params.id);

  if (!restock)
    return res.status(200).json({
      success: true,
      msg: `user with id of ${req.params.id} not found`,
    });
  restock = await restock.remove();

  let inventory = await Inventory.find({
    shop: restock.shop,
    type: restock.type,
  });

  if (inventory.length !== 0) {
    for (var i = 0; i < inventory.length; i++) {
      inventory = await Inventory.findOneAndUpdate(
        { _id: inventory[i]._id },
        {
          qty: parseInt(inventory[i].qty) - parseInt(restock.qty),
        },

        { new: true, runValidators: true }
      );
    }
  }
  let recovery = {
    createdDate: restock.createdAt,
    shop: restock.shop,
    category: restock.category,
    type: restock.type,
    qty: restock.qty,
  };
  await RecoveryRS.create(recovery);
  return res.status(200).json({ success: true, msg: {} });
};
