const mongoose = require("mongoose");

const RestockSchema = new mongoose.Schema({
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
  otherLevel: {
    type: Number,
    required: true,
    trim: true,
    default: 0,
  },
  user: {
    type: String,
    required: true,
    trim: true,
  },
  shop: {
    type: String,
    required: true,
    trim: true,
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

module.exports = mongoose.model("restock", RestockSchema);
