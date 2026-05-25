require("dotenv").config();
const axios = require("axios");

const judge0Client = axios.create({
  baseURL: "https://judge0-ce.p.rapidapi.com",
  headers: {
    "x-rapidapi-key": process.env.RAPID_API_KEY,
    "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

module.exports = judge0Client;
