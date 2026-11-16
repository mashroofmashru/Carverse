import { getImageUrl } from "../config/imageUrl";
import { formatINR, label } from "./format";

const NEW_LISTING_DAYS = 14;

// Turns a car from the API into the props CarCard expects.
// Safe when the dealer account or images are missing.
export const toCarCard = (car, { showCategory = true } = {}) => {
  const parts = [showCategory && label(car.category), label(car.transmission), label(car.fuelType)].filter(Boolean);
  const isNew =
    car.createdAt && Date.now() - new Date(car.createdAt).getTime() < NEW_LISTING_DAYS * 24 * 60 * 60 * 1000;

  return {
    _id: car._id,
    title: car.title,
    details: parts.join(" • "),
    dealer: car.dealerId?.Name ?? "Unknown dealer",
    price: formatINR(car.price),
    imgUrl: car.images?.[0] ? getImageUrl(car.images[0]) : "",
    tag: isNew ? "New" : undefined,
  };
};
