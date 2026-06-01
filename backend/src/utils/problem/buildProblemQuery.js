// utils/buildProblemQuery.js
const { VALID_TAGS } = require('../../models/problem');

const VALID_DIFFICULTIES = ['easy', 'medium', 'hard'];

function buildProblemQuery(params) {
  const filter = {};
  const errors = [];

  if (params.q && params.q.trim() !== '') {
    const q = params.q.trim();

    if (/^\d+$/.test(q)) {
      const num = parseInt(q, 10);
      if (isNaN(num) || num < 1 || num > 99999) {
        errors.push(`Invalid problem number "${q}". Must be a positive integer (1–99999).`);
      } else {
        filter.problemNo = num;
      }
    } else {
      if (q.length > 150) {
        errors.push(`Search query too long. Maximum 150 characters allowed.`);
      } else {
        filter.$text = { $search: q };
      }
    }
  }

  if (params.difficulty) {
    const d = params.difficulty.toLowerCase();
    if (VALID_DIFFICULTIES.includes(d)) {
      filter.difficulty = d;
    }
  }

  if (params.tags) {
    const requested = params.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const allValid = requested.every((t) => VALID_TAGS.includes(t));
    if (allValid && requested.length > 0) {
      // $all ensures AND matching — problem must contain every requested tag
      filter.tags = { $all: requested };
    }
  }

  return { filter, errors };
}

function buildPagination(params) {
  let page = parseInt(params.page, 10);
  let limit = parseInt(params.limit, 10);

  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(limit) || limit < 1) limit = 20;
  if (limit > 100) limit = 100;

  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

module.exports = { buildProblemQuery, buildPagination };
