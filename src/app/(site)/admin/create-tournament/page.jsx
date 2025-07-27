"use client";

import { useState } from "react";
import api from "@/utils/axios";

import { Upload } from "lucide-react";

export default function CreateTournament() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    startDate: "",
    endDate: "",
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) return alert("❌ Please upload an image");

    const data = new FormData();
    Object.entries(formData).forEach(([key, val]) => data.append(key, val));
    data.append("image", image);

    try {
      setLoading(true);
      const res = await api.post("/tournaments", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Tournament created!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to create tournament.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-[var(--card)] text-white rounded-xl max-w-2xl mx-auto shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Create Tournament</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="title" className="block mb-1 text-sm font-medium">
            Tournament Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-[var(--card-background)] outline-none"
            placeholder="Enter tournament name"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block mb-1 text-sm font-medium"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full p-3 rounded bg-[var(--card-background)] outline-none resize-none"
            placeholder="Describe the tournament"
          />
        </div>

        <div>
          <label htmlFor="location" className="block mb-1 text-sm font-medium">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-[var(--card-background)] outline-none"
            placeholder="Enter location"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="startDate"
              className="block mb-1 text-sm font-medium"
            >
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="w-full p-3 rounded bg-[var(--card-background)] outline-none"
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block mb-1 text-sm font-medium">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              className="w-full p-3 rounded bg-[var(--card-background)] outline-none"
            />
          </div>
        </div>
        
        {/* img */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-white mb-2">
            Tournament Banner
          </label>

          <label
            htmlFor="imageUpload"
            className="w-full flex flex-col items-center justify-center gap-3 px-6 py-8 rounded-xl cursor-pointer border-2 border-dashed border-[var(--accent-color)] bg-[var(--card-bg)] text-white text-center transition hover:border-[var(--primary)] hover:bg-[var(--accent-color)]/10"
          >
            <Upload size={20} />

            <span className="text-sm text-gray-300">
              {image ? image.name : "Click to upload image"}
            </span>
          </label>

          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          {image && (
            <div className="mt-4 relative">
              <img
                src={URL.createObjectURL(image)}
                alt="Tournament Preview"
                className="w-full max-h-64 object-cover rounded-lg shadow-lg border border-[var(--accent-color)]"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-[var(--accent-color)] w-full text-[var(--background)] font-medium px-4 py-3 rounded hover:opacity-90 transition"
        >
          {loading ? "Creating..." : "Create Tournament"}
        </button>
      </form>
    </div>
  );
}
