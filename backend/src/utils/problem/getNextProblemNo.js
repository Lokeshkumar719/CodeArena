const Counter = require('../../models/counter');
const ReusableProblemNo = require('../../models/reusableProblemNo');

async function getNextProblemNo() {
  const reusable = await ReusableProblemNo.findOneAndDelete({}, { sort: { value: 1 } });

  if (reusable) {
    return reusable.value;
  }

  const counter = await Counter.findOneAndUpdate(
    { _id: 'problemNo' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  return counter.seq;
}

module.exports = getNextProblemNo;
