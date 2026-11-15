const SERVER_URL = "http://localhost:3000";

// Car images are full Cloudinary URLs; older cars may still have local "/uploads/..." paths.
export const getImageUrl = (path) => {
  if (!path) return "";
  return /^https?:\/\//i.test(path) ? path : `${SERVER_URL}${path}`;
};
