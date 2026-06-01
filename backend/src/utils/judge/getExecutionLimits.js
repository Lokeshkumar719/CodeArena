const getExecutionLimits = (problem) => {
  return {
    cpu_time_limit: problem.timeLimit,
    wall_time_limit: problem.timeLimit + 3,
    memory_limit: problem.memoryLimit,
  };
};

module.exports = getExecutionLimits;
