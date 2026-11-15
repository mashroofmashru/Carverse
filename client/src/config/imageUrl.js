const SERVER_URL = import.meta.env.VITE_API_URL;

// Car images are full Cloudinary URLs; older cars may still have local "/uploads/..." paths.
export const getImageUrl = (path) => {
  if (!path) return "";
  return /^https?:\/\//i.test(path) ? path : `${SERVER_URL}${path}`;
};
