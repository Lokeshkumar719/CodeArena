const { CPU_TIME_MULTIPLIER, WALL_TIME_MULTIPLIER } = require('../../constants/judge0');

const getExecutionLimits = (problem) => {
  return {
    cpu_time_limit: problem.timeLimit * CPU_TIME_MULTIPLIER,
    wall_time_limit: problem.timeLimit * WALL_TIME_MULTIPLIER,
    memory_limit: problem.memoryLimit,
  };
};

module.exports = getExecutionLimits;
