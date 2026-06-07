const mongoose = require('mongoose');
const { Schema } = mongoose;

const VALID_TAGS = [
  'array',
  'string',
  'stack',
  'queue',
  'hashing',
  'sorting',
  'binarySearch',
  'twoPointers',
  'slidingWindow',
  'recursion',
  'backtracking',
  'greedy',
  'heap',
  'trie',
  'graph',
  'dfs',
  'bfs',
  'dp',
  'bitManipulation',
  'math',
  'prefixSum',
  'matrix',
  'unionFind',
  'segmentTree',
  'topologicalSort',
  'shortestPath',
];

const testCaseSchema = new Schema(
  {
    input: { type: String, required: true },
    output: { type: String, required: true },
  },
  { _id: false }
);

const problemSchema = new Schema(
  {
    // --- Identity ---
    problemNo: {
      type: Number,
      required: true,
      unique: true, // enforces uniqueness + creates index automatically
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // --- Content ---
    description: { type: String, required: true, trim: true },
    inputFormat: { type: String, required: true, trim: true },
    outputFormat: { type: String, required: true, trim: true },
    constraints: { type: String, required: true, trim: true },

    // --- Classification ---
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      required: true,
    },
    tags: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => arr.every((tag) => VALID_TAGS.includes(tag)),
        message: (props) => `Invalid tag(s): ${props.value}`,
      },
    },

    // --- Execution config ---
    timeLimit: { type: Number, required: true, default: 2 }, // seconds
    memoryLimit: { type: Number, required: true, default: 262144 }, // KB

    // --- Test cases ---
    visibleTestCases: [
      {
        input: { type: String, required: true },
        output: { type: String, required: true },
        explanation: { type: String, required: true },
        _id: false,
      },
    ],
    hiddenTestCases: [testCaseSchema], // excluded from listing API response

    // --- Code ---
    startCode: [
      {
        language: { type: String, required: true },
        initialCode: { type: String, required: true },
        _id: false,
      },
    ],
    referenceSolution: [
      {
        language: { type: String, required: true },
        completeCode: { type: String, required: true },
        _id: false,
      },
    ],

    // --- Authorship ---
    problemCreator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

problemSchema.index({ title: 'text' });
problemSchema.index({ difficulty: 1, tags: 1 });
problemSchema.index({ createdAt: -1 });

const Problem = mongoose.model('Problem', problemSchema);
module.exports = { Problem, VALID_TAGS };
