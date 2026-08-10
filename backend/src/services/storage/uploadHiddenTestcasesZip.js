const { PutObjectCommand } = require('@aws-sdk/client-s3');

const r2Client = require('../../config/r2Client');

const uploadHiddenTestcasesZip = async (fileBuffer, problemNo) => {
  const key = `problem-${problemNo}.zip`;

  await r2Client.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: fileBuffer,
      ContentType: 'application/zip',
    })
  );

  return {
    key,
  };
};

module.exports = uploadHiddenTestcasesZip;
