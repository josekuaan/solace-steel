const mongoose = require("mongoose");

const RecoveryCTSchema = new mongoose.Schema({
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

module.exports = mongoose.model("recoveryCT", RecoveryCTSchema);
