"use client";

import { useState, useEffect } from "react";
import api from "@/utils/axios";

export default function GamesPage() {
  const [games, setGames] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    genre: "",
    platform: "",
    description: "",
    rulesUrl: "",
    currency: "USD",
  });

  const currencyOptions = ["USD", "PKR", "EUR", "INR"];

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const res = await api.get("/api/games");
      setGames(res.data.data);
    } catch (err) {
      console.error("Failed to fetch games", err);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/games", formData);
      if (res.status === 201) {
        setFormData({
          name: "",
          genre: "",
          platform: "",
          description: "",
          rulesUrl: "",
          currency: "USD",
        });
        fetchGames();
      }
    } catch (err) {
      console.error("Game upload failed", err);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-[color:var(--accent-color)]">Upload Game</h1>

        <form onSubmit={handleSubmit} className="bg-white shadow rounded p-4 space-y-4">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Game Name"
            required
            className="w-full border px-3 py-2 rounded"
          />
          <input
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            placeholder="Genre"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            name="platform"
            value={formData.platform}
            onChange={handleChange}
            placeholder="Platform"
            required
            className="w-full border px-3 py-2 rounded"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            name="rulesUrl"
            value={formData.rulesUrl}
            onChange={handleChange}
            placeholder="Rules URL"
            className="w-full border px-3 py-2 rounded"
          />
          <select
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            {currencyOptions.map((cur) => (
              <option key={cur} value={cur}>
                {cur}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="bg-[color:var(--accent-color)] hover:opacity-90 text-white px-6 py-2 rounded"
          >
            Submit
          </button>
        </form>

        <h2 className="text-xl font-semibold mt-10 mb-3 text-[color:var(--accent-color)]">Games List</h2>
        <div className="space-y-2">
          {games.map((game) => (
            <div key={game._id} className="bg-white border p-4 rounded shadow">
              <h3 className="font-semibold text-lg">{game.name}</h3>
              <p className="text-sm">Genre: {game.genre || "N/A"}</p>
              <p className="text-sm">Platform: {game.platform}</p>
              <p className="text-sm">Currency: {formData.currency}</p>
              {game.rulesUrl && (
                <a
                  href={game.rulesUrl}
                  className="text-blue-500 text-sm underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Rules
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
