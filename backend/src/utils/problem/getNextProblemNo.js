const Counter = require("../../models/counter");
const ReusableProblemNo = require("../../models/reusableProblemNo");

async function getNextProblemNo() {

  // STEP 1:
  // Try reusing smallest available number

  const reusable = await ReusableProblemNo.findOneAndDelete(
    {},
    { sort: { value: 1 } } // smallest first
  );

  if (reusable) {
    return reusable.value;
  }

  // STEP 2:
  // Otherwise increment counter atomically

  const counter = await Counter.findOneAndUpdate(
    { _id: "problemNo" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  return counter.seq;
}

module.exports = getNextProblemNo;