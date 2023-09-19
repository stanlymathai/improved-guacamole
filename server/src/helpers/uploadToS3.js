'use strict';

const fs = require('fs');
const config = require('../configs/env.config/aws.env');
const { PutObjectCommand, S3Client } = require('@aws-sdk/client-s3');

const {
  aws_region,
  aws_access_key_id,
  aws_secret_access_key,

  aws_bucket_name,
} = config;

const CLIENT = new S3Client({
  accessKeyId: aws_access_key_id,
  secretAccessKey: aws_secret_access_key,
  region: aws_region,
});

async function pushToS3(payload) {
  const { fileName, filePath } = payload;
  if (!fileName || !filePath) {
    return { error: 'File name or path is missing' };
  }

  const fileData = fs.readFileSync(filePath);

  const command = new PutObjectCommand({
    Bucket: aws_bucket_name,
    Key: fileName,
    Body: fileData,
  });

  try {
    const data = await CLIENT.send(command);
    data.upload = `https://${aws_bucket_name}.s3.${aws_region}.amazonaws.com/${fileName}`;
    return data;
  } catch (error) {
    console.error(error, 'Error uploading file.');
    return { error };
  } finally {
    fs.unlinkSync(filePath);
  }
}

module.exports = pushToS3;
