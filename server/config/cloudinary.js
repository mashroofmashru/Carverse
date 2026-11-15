const { v2: cloudinary } = require("cloudinary");

// Configured lazily because .env is loaded after this module is required.
let configured = false;
const getCloudinary = () => {
  if (!configured) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
    configured = true;
  }
  return cloudinary;
};

// Uploads a multer in-memory file and returns its secure URL.
const uploadImage = (file, folder = "carverse/cars") =>
  new Promise((resolve, reject) => {
    const stream = getCloudinary().uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => (error ? reject(error) : resolve(result.secure_url))
    );
    stream.end(file.buffer);
  });

// Turns a Cloudinary URL back into its public_id, e.g.
// https://res.cloudinary.com/<cloud>/image/upload/v123/carverse/cars/abc.jpg -> carverse/cars/abc
const getPublicId = (url) => {
  const match = url.match(/res\.cloudinary\.com\/[^/]+\/image\/upload\/(?:v\d+\/)?(.+)\.[a-z0-9]+$/i);
  return match ? match[1] : null;
};

// Deletes images stored on Cloudinary (ignores old local /uploads paths).
const deleteImages = async (urls = []) => {
  const publicIds = urls.map(getPublicId).filter(Boolean);
  if (publicIds.length === 0) return;

  await getCloudinary().api.delete_resources(publicIds);
};

module.exports = { uploadImage, deleteImages };
