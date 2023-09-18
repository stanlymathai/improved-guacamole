'use strict';

const fs = require('fs');
const config = require('../configs/env.config/aws.env');
const { PutObjectCommand, S3Client } = require('@aws-sdk/client-s3');

const {
  aws_region,
  aws_access_key_id,
  aws_secret_access_key,

  aws_bucket_name,
  aws_cloudfront_url,
} = config;

const CLIENT = new S3Client({
  accessKeyId: aws_access_key_id,
  secretAccessKey: aws_secret_access_key,
  region: aws_region,
});

async function upload_to_s3(payload) {
  const { fileName, filePath } = payload;
  if (!fileName || !filePath) {
    return { error: 'File name or path is missing' };
  }

  const bucketName = aws_bucket_name;
  const fileData = fs.readFileSync(filePath);

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileName,
    Body: fileData,
  });

  try {
    const data = await CLIENT.send(command);
    data.upload = `${aws_cloudfront_url}/${fileName}`;
    return data;
  } catch (error) {
    console.error(error, 'Error uploading file.');
    return { error };
  } finally {
    fs.unlinkSync(filePath);
  }
}

module.exports = upload_to_s3;
