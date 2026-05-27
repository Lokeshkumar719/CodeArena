const Counter = require("../models/counter");

/**
 * Atomically increments and returns the next problem number.
 * findOneAndUpdate with upsert:true creates the counter doc on first use.
 * new:true returns the updated doc (post-increment value).
 */
async function getNextProblemNo() {
  const counter = await Counter.findOneAndUpdate(
    { _id: "problemNo" },               // find the problemNo counter
    { $inc: { seq: 1 } },               // atomically increment by 1
    { new: true, upsert: true }         // create if doesn't exist, return updated
  );
  return counter.seq;
}

module.exports = getNextProblemNo;