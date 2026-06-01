const mongoose = require('mongoose');

const reusableProblemNoSchema = new mongoose.Schema({
  value: {
    type: Number,
    required: true,
    unique: true,
  },
});
const ReusableProblemNo = mongoose.model('ReusableProblemNo', reusableProblemNoSchema);
module.exports = ReusableProblemNo;
