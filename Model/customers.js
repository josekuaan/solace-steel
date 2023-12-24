const mongoose = require("mongoose");

const customerSchema = mongoose.Schema({
  customerName: {
    type: String,
    trim: true,
  },
  customerNumber: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    trim: true,
  },
  userId: {
    type: String,
    required: true,
    trim: true,
  },
  paymentType: {
    type: String,
    required: true,
    trim: true,
  },
  prize: {
    type: Number,
    required: true,
    trim: true,
    default: 0,
  },
  quantity: {
    type: Number,
    required: true,
    trim: true,
    default: 0,
  },
  bills: {
    type: Number,

    trim: true,
    default: 0,
  },
  amountPaid: {
    type: Number,

    trim: true,
    default: 0,
  },
  outStandings: {
    type: Number,
    trim: true,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    trim: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
    trim: true,
  },
});

module.exports = mongoose.model("customer", customerSchema);
