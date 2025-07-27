"use client";
import { useState } from "react";

export default function GameForm({ onSubmit, initialData = {}, onClose }) {
  const safeInitialData = initialData || {};

  const [formData, setFormData] = useState({
    name: safeInitialData.name || "",
    genre: safeInitialData.genre || "",
    platform: safeInitialData.platform || "",
    description: safeInitialData.description || "",
    rulesUrl: safeInitialData.rulesUrl || "",
    icon: safeInitialData.icon || "",
    coverImage: safeInitialData.coverImage || "",
  });

  const [icon, setIcon] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "icon") {
      setIcon(files[0]);
    } else if (name === "coverImage") {
      setCoverImage(files[0]);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    if (icon) data.append("icon", icon);
    if (coverImage) data.append("coverImage", coverImage);

    onSubmit(data);
    if (onClose) onClose();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[var(--card-background)] shadow-md rounded-xl p-6 space-y-5"
      encType="multipart/form-data"
    >
      <h2 className="text-xl font-semibold text-white mb-2">Game Details</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Game Name *"
          required
          className="p-2 rounded border border-[var(--border-color)] bg-[var(--card-background)] text-[var(--foreground)]"
        />
        <input
          name="genre"
          value={formData.genre}
          onChange={handleChange}
          placeholder="Genre"
          className="p-2 rounded border border-[var(--border-color)] bg-[var(--card-background)] text-[var(--foreground)]"
        />
        <input
          name="platform"
          value={formData.platform}
          onChange={handleChange}
          placeholder="Platform *"
          required
          className="p-2 rounded border border-[var(--border-color)] bg-[var(--card-background)] text-[var(--foreground)]"
        />
        <input
          name="rulesUrl"
          value={formData.rulesUrl}
          onChange={handleChange}
          placeholder="Rules URL"
          className="p-2 rounded border border-[var(--border-color)] bg-[var(--card-background)] text-[var(--foreground)]"
        />
     
     
      </div>

      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Game Description"
        className="p-2 w-full rounded border border-[var(--border-color)] bg-[var(--card-background)] text-[var(--foreground)] min-h-[100px]"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* Icon Upload */}
        <div className="space-y-2">
          <label className="font-semibold text-sm">Game Logo (Icon):</label>
          <div className="relative border-2 border-dashed border-[var(--accent-color)] rounded-lg p-4 text-center cursor-pointer hover:bg-[var(--accent-color-light)]">
            <input
              type="file"
              name="icon"
              accept="image/*"
              onChange={handleChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <p className="text-sm text-gray-500">Click or drag file to upload logo</p>
            {icon && (
              <img
                src={URL.createObjectURL(icon)}
                alt="Preview"
                className="mt-2 max-h-24 mx-auto rounded object-contain"
              />
            )}
            {!icon && formData.icon && (
              <img
                src={formData.icon}
                alt="Current Icon"
                className="mt-2 max-h-24 mx-auto rounded object-contain"
              />
            )}
          </div>
        </div>

        {/* Cover Upload */}
        <div className="space-y-2">
          <label className="font-semibold text-sm">Game Banner (Cover Image):</label>
          <div className="relative border-2 border-dashed border-[var(--accent-color)] rounded-lg p-4 text-center cursor-pointer hover:bg-[var(--accent-color-light)]">
            <input
              type="file"
              name="coverImage"
              accept="image/*"
              onChange={handleChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <p className="text-sm text-gray-500">Click or drag file to upload banner</p>
            {coverImage && (
              <img
                src={URL.createObjectURL(coverImage)}
                alt="Preview"
                className="mt-2 max-h-32 w-full object-cover rounded"
              />
            )}
            {!coverImage && formData.coverImage && (
              <img
                src={formData.coverImage}
                alt="Current Cover"
                className="mt-2 max-h-32 w-full object-cover rounded"
              />
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded border border-gray-400 hover:bg-gray-100"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="bg-[var(--accent-color)] hover:opacity-90 text-white px-6 py-2 rounded"
        >
          Save Game
        </button>
      </div>
    </form>
  );
}
