const dotenv = require("dotenv");
const { S3Client } = require("@aws-sdk/client-s3");
// get configurations

dotenv.config();
const bucketName = process.env.BUCKET_NAME;
const region = process.env.BUCKET_REGION;
const accessKeyId = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRETE_KEY;

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});
module.exports = { s3Client, bucketName };
