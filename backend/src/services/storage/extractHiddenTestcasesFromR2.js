const { GetObjectCommand } = require('@aws-sdk/client-s3');

const r2Client = require('../../config/r2Client');

const extractHiddenTestcasesFromZip = require('./extractHiddenTestcasesFromZip');

const ApiError = require('../../utils/ApiError');

const extractHiddenTestcasesFromR2 = async (hiddenTestCasesZip) => {
  if (!hiddenTestCasesZip?.key) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'Hidden testcase ZIP not found');
  }
  const response = await r2Client.send(
    new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: hiddenTestCasesZip.key,
    })
  );

  const chunks = [];

  for await (const chunk of response.Body) {
    chunks.push(chunk);
  }

  const zipBuffer = Buffer.concat(chunks);

  return extractHiddenTestcasesFromZip(zipBuffer);
};

module.exports = extractHiddenTestcasesFromR2;
