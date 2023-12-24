const Customers = require("../Model/customers");

exports.customer = async (req, res) => {
  let customers;
  let total;

  const LIMIT = 10;

  const { page } = req.query;
  // console.log(pageNumber.page);
  if (page) {
    const startIndex = (Number(page) - 1) * LIMIT;

    total = await Customers.countDocuments();

    customers = await Customers.find()
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex);
  } else {
    customers = await Customers.find();
  }

  if (!customers) {
    return res.status(400).json({
      success: false,
      msg: `Something went wrong contact your Administrator`,
    });
  }

  res.status(200).json({
    success: true,
    message: "Fetched Successfully",
    customers,
    total: total,
    currentPage: Number(page),
    numberOfPages: Math.ceil(total / LIMIT),
  });
};

//@desc    Get update user
//@route   GET /api/auth/updateCustomers/:id
//@access  Private/admin
exports.updateCustomers = async (req, res) => {
  console.log(req.body);
  const getCustomer = await Customers.findById(req.params.id);

  if (getCustomer) {
    const outStandings = getCustomer.outStandings - Number(req.body.prize);
    const amountPaid = getCustomer.amountPaid + Number(req.body.prize);

    const customer = await Customers.findByIdAndUpdate(
      req.params.id,
      {
        amountPaid,
        outStandings,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!customer)
      return res.status(401).json({ success: false, msg: `No record` });
    console.log(customer);
    res.status(200).json({ success: true, customer });
  }
};

//@desc    Delete a user
//@route   DELETE /api/v1/Customers/:id
//@access  Private
exports.deleteCustomer = async (req, res, next) => {
  let customer = await Customers.findById(req.params.id);

  if (!customer)
    return res.status(200).json({
      success: true,
      msg: `user with id of ${req.params.id} not found`,
    });
  customer = await customer.remove();
  console.log();
  return res.status(200).json({ success: true, msg: {} });
};
