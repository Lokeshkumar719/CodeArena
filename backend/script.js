require('dotenv').config();

const connectDB = require('./src/config/db');
const { Problem } = require('./src/models/problem');
const slugify = require('./src/utils/problem/slugify');

const migrate = async () => {
  try {
    await connectDB();

    const problems = await Problem.find();

    for (const problem of problems) {
      problem.slug = slugify(problem.title);
      await problem.save();
    }

    console.log(`Updated ${problems.length} problems`);

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

migrate();
