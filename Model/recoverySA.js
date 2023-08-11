const mongoose = require("mongoose");

const RecoverySalesSchema = new mongoose.Schema({
  payment: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },

  qty: {
    type: Number,
    required: true,
    trim: true,
    default: 0,
  },
  shop: {
    type: String,
    required: true,
    trim: true,
  },

  createdDate: {
    type: String,
    trim: true,
  },
  deletedDate: {
    type: Date,
    default: Date.now(),
    trim: true,
  },
});

module.exports = mongoose.model("recoverySales", RecoverySalesSchema);
