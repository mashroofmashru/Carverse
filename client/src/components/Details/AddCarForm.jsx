import React, { useState } from "react";
import { Plus, X, UploadCloud } from "lucide-react";
import api from '../../config/server'
const AddCarForm = ({ onClose }) => {
    // const [email, setEmail] = useState()
    const [title, setTitle] = useState("");
    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [year, setYear] = useState("");
    const [price, setPrice] = useState("");
    const [fuelType, setFuelType] = useState("PETROL");
    const [category,setCategory]=useState("SEDAN")
    const [transmission, setTransmission] = useState("MANUAL");
    const [mileage, setMileage] = useState("");
    const [color, setColor] = useState("");
    const [description, setDescription] = useState("");
    const [images, setImages] = useState([]);
    const handleImageUpload = (e) => {
        setImages([...images, ...Array.from(e.target.files)]);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        // data.append("email", email)
        data.append("title", title);
        data.append("brand", brand);
        data.append("model", model);
        data.append("year", year);
        data.append("price", price);
        data.append("fuelType", fuelType);
        data.append("category", category)
        data.append("transmission", transmission);
        data.append("mileage", mileage);
        data.append("color", color);
        data.append("description", description);

        images.forEach((file) => {
            data.append("images", file);
        });

        try {
            await api.post("/dealer/addcar", data);
            alert("Vehicle Added Successfully");
            onClose();
        } catch (err) {
            console.error(err.response?.data || err);
            alert("Failed to upload vehicle");
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-gray-900/75 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">

                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Add New Vehicle</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            name="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="TITLE"
                            required
                            className="w-full rounded-lg border-gray-300 focus:outline-none focus:ring-0 focus:border-transparent"
                        />
                        <input
                            name="brand"
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                            placeholder="BRAND"
                            required
                            className="w-full rounded-lg border-gray-300 focus:outline-none focus:ring-0 focus:border-transparent"
                        />
                        <input
                            name="model"
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            placeholder="MODEL"
                            required
                            className="w-full rounded-lg border-gray-300 focus:outline-none focus:ring-0 focus:border-transparent"
                        />

                        <input
                            type="number"
                            name="year"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            placeholder="Year"
                            required
                            min={2010}
                            max={2025}
                            className="w-full rounded-lg border-gray-300 focus:outline-none focus:ring-0 focus:border-transparent"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            type="number"
                            name="price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Price"
                            min="100000"
                            step="1000"
                            required
                            className="w-full rounded-lg border-gray-300 focus:outline-none focus:ring-0 focus:border-transparent"
                        />

                        <select
                            name="fuelType"
                            value={fuelType}
                            onChange={(e) => setFuelType(e.target.value)}
                            className="w-full rounded-lg border-gray-300 focus:outline-none focus:ring-0 focus:border-transparent"
                        >
                            <option value="PETROL">Petrol</option>
                            <option value="DIESEL">Diesel</option>
                            <option value="ELECTRIC">Electric</option>
                            <option value="HYBRID">Hybrid</option>
                        </select>
                        <select
                            name="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full rounded-lg border-gray-300 focus:outline-none focus:ring-0 focus:border-transparent"
                        >
                            <option value="SUVs">SUVs</option>
                            <option value="SEDAN">Sedan</option>
                            <option value="HATCHBACK">Hatchback</option>
                            <option value="ELECTRIC">Electric</option>
                        </select>
                        
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <select
                            name="transmission"
                            value={transmission}
                            onChange={(e) => setTransmission(e.target.value)}
                            className="w-full rounded-lg border-gray-300 focus:outline-none focus:ring-0 focus:border-transparent"
                        >
                            <option value="MANUAL">Manual</option>
                            <option value="AUTOMATIC">Automatic</option>
                        </select>
                        <input
                            type="number"
                            name="mileage"
                            value={mileage}
                            onChange={(e) => setMileage(e.target.value)}
                            placeholder="Mileage"
                            min="0"
                            required
                            className="w-full rounded-lg border-gray-300 focus:outline-none focus:ring-0 focus:border-transparent"
                        />

                        <input
                            type="text"
                            name="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            placeholder="Color"
                            required
                            className="w-full rounded-lg border-gray-300 focus:outline-none focus:ring-0 focus:border-transparent"
                        />
                    </div>

                    <textarea
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="3"
                        placeholder="Description"
                        required
                        className="w-full rounded-lg border-gray-300 focus:outline-none focus:ring-0 focus:border-transparent"
                    />

                    <div>
                        <label className="flex items-center gap-2 cursor-pointer text-blue-600">
                            <UploadCloud />
                            Upload Images
                            <input
                                type="file"
                                multiple
                                hidden
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                        </label>

                        <p className="text-sm text-gray-500 mt-1">
                            {images.length} file(s) selected
                        </p>

                        {/* Optional: show file names */}
                        {images.length > 0 && (
                            <ul className="mt-2 text-xs text-gray-400 list-disc list-inside">
                                {images.map((file, index) => (
                                    <li key={index}>{file.name}</li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 flex items-center justify-center gap-2"
                    >
                        <Plus />
                        List Vehicle
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddCarForm;
