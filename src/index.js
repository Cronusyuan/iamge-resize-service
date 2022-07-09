const sharp = require("sharp");
const AWS = require("aws-sdk");

const s3 = new AWS.S3();

exports.handler = async (event) => {
  const { image, width } = event.pathParameters;
  console.log(`Get image ${image} of size ${width}`);

  const file = await s3
    .getObject({
      Bucket: process.env.PRIVATE_BUCKET_NAME,
      Key: image,
    })
    .promise()
    .catch((err) => {
      console.log(err);
      return null;
    });

  if (!file) {
    return {
      statusCode: 404,
      body: `Image ${image} not found.`,
    };
  }

  const { data, info } = await sharp(file.Body)
    .resize({ width: parseInt(width) })
    .toBuffer({ resolveWithObject: true });

  await s3
    .putObject({
      Bucket: process.env.CDN_BUCKET_NAME,
      Key: `image/${width}/${image}`,
      Body: data,
      ContentType: "image/" + info.format,
      Metadata: {
        original_key: image,
      },
    })
    .promise();

  return {
    statusCode: 200,
    body: data.toString("base64"),
    isBase64Encoded: true,
    headers: {
      "Content-Type": "image/" + info.format,
    },
  };
};
