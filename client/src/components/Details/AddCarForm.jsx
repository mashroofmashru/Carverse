import React, { useEffect, useRef, useState } from "react";
import { X, UploadCloud, Loader2 } from "lucide-react";
import api from "../../config/server";
import { useToast } from "../../context/ToastContext";
import Modal from "../common/Modal";

const MAX_IMAGES = 10;
const MAX_IMAGE_MB = 5;
const MIN_YEAR = 1990;
const MAX_YEAR = new Date().getFullYear() + 1;

const Field = ({ label, htmlFor, hint, children }) => (
  <div>
    <label htmlFor={htmlFor} className="label">
      {label}
      <span className="text-red-700" aria-hidden="true">
        {" "}
        *
      </span>
    </label>
    {children}
    {hint && <p className="mt-1 text-xs text-gray-600">{hint}</p>}
  </div>
);

const Section = ({ title, children }) => (
  <fieldset className="space-y-4">
    <legend className="mb-1 border-b border-neutral-200 pb-2 text-sm font-semibold w-full">{title}</legend>
    {children}
  </fieldset>
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
  const [photoError, setPhotoError] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
    const valid = picked.filter((f) => f.size <= MAX_IMAGE_MB * 1024 * 1024);
    const room = MAX_IMAGES - images.length;

    const problems = [];
    if (tooBig.length) problems.push(`${tooBig.map((f) => f.name).join(", ")} is larger than ${MAX_IMAGE_MB} MB.`);
    if (valid.length > room) problems.push(`You can upload up to ${MAX_IMAGES} photos.`);
    setPhotoError(problems.join(" "));

    setImages([...images, ...valid.slice(0, Math.max(room, 0)).map((file) => ({ file, url: URL.createObjectURL(file) }))]);
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(images[index].url);
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      setPhotoError("Please add at least one photo.");
      // The photo section can be below the fold in the dialog, so bring the message into view
      requestAnimationFrame(() => document.getElementById("photo-error")?.scrollIntoView({ block: "center", behavior: "smooth" }));
      return;
    }
    setPhotoError("");

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
    <Modal title="Add new vehicle" subtitle="Fields marked * are required" onClose={onClose} locked={submitting} titleId="add-car-title">
      <form onSubmit={handleSubmit}>
        <div className="space-y-7 p-6">
          <Section title="Basics">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <Field label="Listing title" htmlFor="car-title">
                  <input id="car-title" name="title" value={form.title} onChange={update} required placeholder="e.g. Well-kept family SUV" className="field" />
                </Field>
              </div>
              <Field label="Brand" htmlFor="car-brand">
                <input id="car-brand" name="brand" value={form.brand} onChange={update} required placeholder="e.g. Toyota" className="field" />
              </Field>
              <Field label="Model" htmlFor="car-model">
                <input id="car-model" name="model" value={form.model} onChange={update} required placeholder="e.g. Fortuner" className="field" />
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
                  className="field"
                />
              </Field>
              <Field label="Color" htmlFor="car-color">
                <input id="car-color" name="color" value={form.color} onChange={update} required placeholder="e.g. Pearl White" className="field" />
              </Field>
            </div>
          </Section>

          <Section title="Price and specifications">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                  className="field"
                />
              </Field>
              <Field label="Mileage (km)" htmlFor="car-mileage" hint="Odometer reading">
                <input
                  id="car-mileage"
                  type="number"
                  name="mileage"
                  value={form.mileage}
                  onChange={update}
                  required
                  min="0"
                  placeholder="e.g. 35000"
                  className="field"
                />
              </Field>
              <Field label="Category" htmlFor="car-category">
                <select id="car-category" name="category" value={form.category} onChange={update} className="field cursor-pointer">
                  <option value="SUVs">SUV</option>
                  <option value="SEDAN">Sedan</option>
                  <option value="HATCHBACK">Hatchback</option>
                  <option value="ELECTRIC">Electric</option>
                </select>
              </Field>
              <Field label="Fuel type" htmlFor="car-fuel">
                <select id="car-fuel" name="fuelType" value={form.fuelType} onChange={update} className="field cursor-pointer">
                  <option value="PETROL">Petrol</option>
                  <option value="DIESEL">Diesel</option>
                  <option value="ELECTRIC">Electric</option>
                  <option value="HYBRID">Hybrid</option>
                </select>
              </Field>
              <Field label="Transmission" htmlFor="car-transmission">
                <select id="car-transmission" name="transmission" value={form.transmission} onChange={update} className="field cursor-pointer">
                  <option value="MANUAL">Manual</option>
                  <option value="AUTOMATIC">Automatic</option>
                </select>
              </Field>
            </div>
          </Section>

          <Section title="Photos">
            <label
              className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-gray-700 transition focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-ink hover:border-ink hover:bg-mist ${
                photoError ? "border-red-600" : "border-neutral-300"
              } ${images.length >= MAX_IMAGES ? "pointer-events-none opacity-60" : ""}`}
            >
              <UploadCloud size={26} aria-hidden="true" />
              <span className="text-sm font-semibold">Click to add photos</span>
              <span className="text-xs text-gray-600">
                {images.length}/{MAX_IMAGES} added · max {MAX_IMAGE_MB} MB each · the first photo is the cover
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                disabled={images.length >= MAX_IMAGES}
                className="sr-only"
                aria-describedby={photoError ? "photo-error" : undefined}
              />
            </label>
            {photoError && (
              <p id="photo-error" role="alert" className="text-sm font-medium text-red-700">
                {photoError}
              </p>
            )}

            {images.length > 0 && (
              <ul className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                {images.map((img, index) => (
                  <li key={img.url} className="relative aspect-square overflow-hidden rounded-lg border border-neutral-200">
                    <img src={img.url} alt={img.file.name} className="h-full w-full object-cover" />
                    {index === 0 && <span className="badge badge-brand absolute bottom-1 left-1">Cover</span>}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black focus-visible:outline-3 focus-visible:outline-brand"
                      aria-label={`Remove ${img.file.name}`}
                    >
                      <X size={14} aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          <Section title="Description">
            <Field label="About this vehicle" htmlFor="car-description">
              <textarea
                id="car-description"
                name="description"
                value={form.description}
                onChange={update}
                required
                rows="4"
                placeholder="Condition, service history, extras…"
                className="field"
              />
            </Field>
          </Section>
        </div>

        <div className="sticky bottom-0 flex justify-end gap-3 border-t border-neutral-200 bg-white px-6 py-4">
          <button type="button" onClick={onClose} disabled={submitting} className="btn btn-light">
            Cancel
          </button>
          <button type="submit" disabled={submitting} className="btn btn-brand min-w-36">
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" aria-hidden="true" /> Uploading…
              </>
            ) : (
              "Add vehicle"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddCarForm;
