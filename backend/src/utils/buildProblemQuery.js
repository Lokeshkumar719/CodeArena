// utils/buildProblemQuery.js
const { VALID_TAGS } = require("../models/problem");

const VALID_DIFFICULTIES = ["easy", "medium", "hard"];

/**
 * Builds a MongoDB filter object from validated query params.
 *
 * Error behaviour:
 *   - problemNo (q=<numeric>): throws if value looks numeric but is out of range or malformed
 *   - title (q=<text>): throws if query string exceeds safe length
 *   - All other fields: silently skip if invalid/unrecognized
 *
 * @param {object} params - Raw query params from req.query
 * @returns {{ filter: object, errors: string[] }}
 */
function buildProblemQuery(params) {
  const filter = {};
  const errors = [];

  // ── Search: numeric → problemNo exact match, text → title full-text ──────
  if (params.q && params.q.trim() !== "") {
    const q = params.q.trim();

    if (/^\d+$/.test(q)) {
      // Numeric query — validate: must be a positive integer within sane range
      const num = parseInt(q, 10);
      if (isNaN(num) || num < 1 || num > 99999) {
        // ERROR: user clearly intended a problem number — wrong value deserves feedback
        errors.push(`Invalid problem number "${q}". Must be a positive integer (1–99999).`);
      } else {
        filter.problemNo = num;
      }
    } else {
      // Text query — validate: guard against absurdly long strings hitting $text index
      if (q.length > 150) {
        // ERROR: user is searching by title — garbage input deserves feedback
        errors.push(`Search query too long. Maximum 150 characters allowed.`);
      } else {
        filter.$text = { $search: q };
      }
    }
  }

  // ── Difficulty: silently skip if value is not easy | medium | hard ────────
  if (params.difficulty) {
    const d = params.difficulty.toLowerCase();
    if (VALID_DIFFICULTIES.includes(d)) {
      filter.difficulty = d;
    }
    // Invalid value → do nothing, no error
  }

  // ── Tags: silently skip the entire tags filter if ANY tag is unrecognized ──
  if (params.tags) {
    const requested = params.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const allValid = requested.every((t) => VALID_TAGS.includes(t));
    if (allValid && requested.length > 0) {
      // $all ensures AND matching — problem must contain every requested tag
      filter.tags = { $all: requested };
    }
    // Any invalid tag in the list → skip the entire tags filter, no error
  }

  // ── Status is handled in service layer (needs Submission lookup) ──────────

  return { filter, errors };
}

/**
 * Parses and validates pagination params.
 * Always returns safe defaults — never errors.
 *
 * @param {object} params
 * @returns {{ page: number, limit: number, skip: number }}
 */
function buildPagination(params) {
  let page  = parseInt(params.page,  10);
  let limit = parseInt(params.limit, 10);

  if (isNaN(page)  || page  < 1) page  = 1;
  if (isNaN(limit) || limit < 1) limit = 20;
  if (limit > 100) limit = 100; // hard cap — prevent abuse

  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

module.exports = { buildProblemQuery, buildPagination };