import React, { useEffect, useRef, useState } from "react";
import { X, UploadCloud } from "lucide-react";
import api from "../../config/server";
import { useToast } from "../../context/ToastContext";
import useModal from "../../hooks/useModal";

const MAX_IMAGES = 10;
const MAX_IMAGE_MB = 5;
const MIN_YEAR = 1990;
const MAX_YEAR = new Date().getFullYear() + 1;

const inputClass =
  "w-full px-4 py-3 border border-gray-300 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition";

const Field = ({ label, htmlFor, children }) => (
  <div>
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    {children}
  </div>
);

const AddCarForm = ({ onClose, onAdded }) => {
  const { showToast } = useToast();

  const [form, setForm] = useState({
    title: "",
    brand: "",
    model: "",
    year: "",
    price: "",
    fuelType: "PETROL",
    category: "SEDAN",
    transmission: "MANUAL",
    mileage: "",
    color: "",
    description: "",
  });
  const [images, setImages] = useState([]); // [{ file, url }]
  const [submitting, setSubmitting] = useState(false);

  useModal(true, submitting ? undefined : onClose);

  // Free preview URLs only when the form closes
  const imagesRef = useRef(images);
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);
  useEffect(() => () => imagesRef.current.forEach((img) => URL.revokeObjectURL(img.url)), []);

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageUpload = (e) => {
    const picked = Array.from(e.target.files || []);
    e.target.value = ""; // allow picking the same file again after removing it

    const tooBig = picked.filter((f) => f.size > MAX_IMAGE_MB * 1024 * 1024);
    if (tooBig.length) {
      showToast(`${tooBig.map((f) => f.name).join(", ")} is larger than ${MAX_IMAGE_MB} MB`, "error");
    }

    const valid = picked.filter((f) => f.size <= MAX_IMAGE_MB * 1024 * 1024);
    const room = MAX_IMAGES - images.length;
    if (valid.length > room) {
      showToast(`You can upload up to ${MAX_IMAGES} images`, "error");
    }

    setImages([...images, ...valid.slice(0, Math.max(room, 0)).map((file) => ({ file, url: URL.createObjectURL(file) }))]);
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(images[index].url);
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      showToast("Please add at least one photo", "error");
      return;
    }

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    images.forEach(({ file }) => data.append("images", file));

    setSubmitting(true);
    try {
      await api.post("/dealer/addcar", data);
      showToast("Vehicle added successfully");
      onAdded?.();
      onClose();
    } catch (err) {
      console.error(err.response?.data || err);
      showToast(err.response?.data?.message || "Failed to upload vehicle. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-gray-900/75 flex items-center justify-center p-4"
      onClick={submitting ? undefined : onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-car-title"
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 id="add-car-title" className="text-2xl font-bold">
            Add New Vehicle
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            aria-label="Close"
          >
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Listing title" htmlFor="car-title">
              <input id="car-title" name="title" value={form.title} onChange={update} required placeholder="e.g. Well-kept family SUV" className={inputClass} />
            </Field>
            <Field label="Brand" htmlFor="car-brand">
              <input id="car-brand" name="brand" value={form.brand} onChange={update} required placeholder="e.g. Toyota" className={inputClass} />
            </Field>
            <Field label="Model" htmlFor="car-model">
              <input id="car-model" name="model" value={form.model} onChange={update} required placeholder="e.g. Fortuner" className={inputClass} />
            </Field>
            <Field label="Year" htmlFor="car-year">
              <input
                id="car-year"
                type="number"
                name="year"
                value={form.year}
                onChange={update}
                required
                min={MIN_YEAR}
                max={MAX_YEAR}
                placeholder={String(MAX_YEAR - 1)}
                className={inputClass}
              />
            </Field>
            <Field label="Your price (₹)" htmlFor="car-price">
              <input
                id="car-price"
                type="number"
                name="price"
                value={form.price}
                onChange={update}
                required
                min="100000"
                step="1000"
                placeholder="e.g. 850000"
                className={inputClass}
              />
            </Field>
            <Field label="Mileage (km)" htmlFor="car-mileage">
              <input
                id="car-mileage"
                type="number"
                name="mileage"
                value={form.mileage}
                onChange={update}
                required
                min="0"
                placeholder="e.g. 35000"
                className={inputClass}
              />
            </Field>
            <Field label="Category" htmlFor="car-category">
              <select id="car-category" name="category" value={form.category} onChange={update} className={inputClass}>
                <option value="SUVs">SUV</option>
                <option value="SEDAN">Sedan</option>
                <option value="HATCHBACK">Hatchback</option>
                <option value="ELECTRIC">Electric</option>
              </select>
            </Field>
            <Field label="Fuel type" htmlFor="car-fuel">
              <select id="car-fuel" name="fuelType" value={form.fuelType} onChange={update} className={inputClass}>
                <option value="PETROL">Petrol</option>
                <option value="DIESEL">Diesel</option>
                <option value="ELECTRIC">Electric</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </Field>
            <Field label="Transmission" htmlFor="car-transmission">
              <select id="car-transmission" name="transmission" value={form.transmission} onChange={update} className={inputClass}>
                <option value="MANUAL">Manual</option>
                <option value="AUTOMATIC">Automatic</option>
              </select>
            </Field>
            <Field label="Color" htmlFor="car-color">
              <input id="car-color" name="color" value={form.color} onChange={update} required placeholder="e.g. Pearl White" className={inputClass} />
            </Field>
          </div>

          <Field label="Description" htmlFor="car-description">
            <textarea
              id="car-description"
              name="description"
              value={form.description}
              onChange={update}
              required
              rows="4"
              placeholder="Condition, service history, extras…"
              className={inputClass}
            />
          </Field>

          <div>
            <span className="block text-sm font-medium text-gray-700 mb-1">
              Photos ({images.length}/{MAX_IMAGES}, max {MAX_IMAGE_MB} MB each)
            </span>
            <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-blue-400 hover:bg-blue-50/40 transition text-gray-500">
              <UploadCloud aria-hidden="true" />
              <span className="text-sm font-medium">Click to add photos</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                disabled={images.length >= MAX_IMAGES}
                className="sr-only"
              />
            </label>

            {images.length > 0 && (
              <ul className="mt-3 grid grid-cols-3 sm:grid-cols-5 gap-2">
                {images.map((img, index) => (
                  <li key={img.url} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                    <img src={img.url} alt={img.file.name} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white hover:bg-black/80"
                      aria-label={`Remove ${img.file.name}`}
                    >
                      <X size={12} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {submitting ? "Uploading…" : "Add Vehicle"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCarForm;
