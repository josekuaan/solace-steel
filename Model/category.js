const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: Array,
    required: true,
    trim: true,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
    trim: true,
  },
});

module.exports = mongoose.model("category", CategorySchema);
