const { DeleteObjectCommand } = require('@aws-sdk/client-s3');

const r2Client = require('../../config/r2Client');

const deleteHiddenTestcasesZip = async (hiddenTestCasesZip) => {
  if (!hiddenTestCasesZip?.key) {
    return;
  }

  await r2Client.send(
    new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: hiddenTestCasesZip.key,
    })
  );
};

module.exports = deleteHiddenTestcasesZip;
