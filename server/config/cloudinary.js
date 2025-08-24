const cloudinary = require("cloudinary").v2;
require("dotenv").config();

exports.cloudinaryConnect = () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_KEY,
      api_secret: process.env.CLOUDINARY_SECRET,
    });
    console.log("Cloudinary connected successfully");
  } catch (error) {
    console.log("error while connecting to cloudinary", error.message);
  }
};

exports.uploadFileToCloudinary = async (file, folder) => {
  return await cloudinary.uploader.upload(file.tempFilePath, { folder });
};
