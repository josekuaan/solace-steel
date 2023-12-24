const mongoose = require("mongoose");

const SalesSchema = new mongoose.Schema({
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
  payment: {
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
  qty: {
    type: Number,
    required: true,
    trim: true,
    default: 0,
  },
  convertedqty: {
    type: Number,
    required: true,
    trim: true,
    default: 0,
  },

  shop: {
    type: String,
    trim: true,
    default: "-",
  },
  user: {
    type: String,
    required: true,
    trim: true,
    default: "user",
  },
  userId: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    trim: true,
  },
});

module.exports = mongoose.model("sales", SalesSchema);
