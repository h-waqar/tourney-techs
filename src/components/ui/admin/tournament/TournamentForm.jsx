"use client";

import { useState, useEffect } from "react";
import { Upload, X } from "lucide-react";
import api from "@/utils/axios";
import { toast } from "react-hot-toast";

export default function TournamentForm({ initialData, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    startDate: "",
    endDate: "",
    status: "upcoming",
    bannerUrl: "",
  });

  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [gamesList, setGamesList] = useState([]);
  const [gameFields, setGameFields] = useState([]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        location: initialData.location || "",
        startDate: initialData.startDate?.slice(0, 10) || "",
        endDate: initialData.endDate?.slice(0, 10) || "",
        status: initialData.status || "upcoming",
        bannerUrl: initialData.bannerUrl || "",
      });
      setGameFields(
        (initialData.games || []).map((g) => ({
          gameConfigId: g._id || "",
          game: typeof g.game === "object" ? g.game._id : g.game,
          entryFee: g.entryFee,
          format: g.format || "single_elimination",
          teamBased: g.teamBased || false,
          minPlayers: g.minPlayers,
          maxPlayers: g.maxPlayers,
        }))
      );

      if (initialData.bannerUrl) {
        setPreviewUrl(initialData.bannerUrl);
      }
    }
  }, [initialData]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await api.get("/api/games");
        setGamesList(res.data.data || []);
      } catch (err) {
        console.error("Failed to load games", err);
        setGamesList([]);
      }
    };
    fetchGames();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAddGameFields = () => {
    setGameFields((prev) => [
      ...prev,
      {
        game: "",
        entryFee: "",
        format: "single_elimination",
        teamBased: false,
        minPlayers: "",
        maxPlayers: "",
      },
    ]);
  };

  const handleGameFieldChange = (index, name, value) => {
    const updated = [...gameFields];
    if (name === "teamBased") {
      updated[index][name] = value === true || value === "true";
    } else if (["entryFee", "minPlayers", "maxPlayers"].includes(name)) {
      updated[index][name] = value === "" ? "" : Number(value);
    } else {
      updated[index][name] = value;
    }
    setGameFields(updated);
  };

  const handleRemoveGameField = async (index) => {
    const field = gameFields[index];
    if (field.gameConfigId && initialData?._id) {
      try {
        await api.delete(
          `/api/tournaments/${initialData._id}/games/${field.gameConfigId}`
        );
        toast.success("Game deleted!");
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete game.");
        return;
      }
    }
    setGameFields((prev) => prev.filter((_, i) => i !== index));
  };

  const updateTournamentGame = async (gameConfigId, updatedGame) => {
    try {
      await api.patch(
        `/api/tournaments/${initialData._id}/games/${gameConfigId}`,
        updatedGame
      );
      toast.success("Game updated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update game.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let bannerUrl = formData.bannerUrl;

      if (image && initialData?._id) {
        const imageForm = new FormData();
        imageForm.append("banner", image);
        const uploadRes = await api.post(
          `/api/tournaments/${initialData._id}/upload-banner`,
          imageForm,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        bannerUrl = uploadRes.data.bannerUrl;
      }

      const validGames = gameFields.filter(
        (g) =>
          g.game &&
          !isNaN(g.entryFee) &&
          !isNaN(g.minPlayers) &&
          !isNaN(g.maxPlayers)
      );

      const jsonPayload = {
        ...formData,
        bannerUrl,
        isPublic: true,
      };

      if (initialData?._id) {
        // 🔁 Update Tournament
        await api.patch(`/api/tournaments/${initialData._id}`, jsonPayload);

        // 🎯 Update or Add Games
        for (const g of validGames) {
          const gameData = {
            game: g.game,
            entryFee: Number(g.entryFee),
            format: g.format || "single_elimination",
            teamBased: Boolean(g.teamBased),
            minPlayers: Number(g.minPlayers),
            maxPlayers: Number(g.maxPlayers),
          };

          if (g.gameConfigId) {
            // ✅ Update existing game
            await api.patch(
              `/api/tournaments/${initialData._id}/games/${g.gameConfigId}`,
              gameData,
              { headers: { "Content-Type": "application/json" } }
            );
          } else {
            // ➕ Add new game
            await api.post(
              `/api/tournaments/${initialData._id}/games`,
              gameData,
              { headers: { "Content-Type": "application/json" } }
            );
          }
        }

        toast.success("Tournament updated!");
      } else {
        // Create New Tournament
        const createForm = new FormData();
        Object.entries({
          ...jsonPayload,
          games: validGames,
        }).forEach(([key, value]) => {
          createForm.append(
            key,
            key === "games" ? JSON.stringify(value) : value
          );
        });

        if (image) {
          createForm.append("banner", image);
        }

        await api.post("/api/tournaments", createForm, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        toast.success("Tournament created!");
      }

      onSuccess?.();
      onClose?.();
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || "Failed to save tournament."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-[var(--card)] text-white rounded-xl max-w-3xl mx-auto shadow-lg">
      <h2 className="text-2xl font-bold mb-6">
        {initialData ? "Edit Tournament" : "Create Tournament"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Tournament name"
          className="w-full p-3 rounded bg-[var(--card-background)] outline-none"
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full p-3 rounded bg-[var(--card-background)] outline-none resize-none"
          placeholder="Describe the tournament"
        />

        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
          placeholder="Enter location"
          className="w-full p-3 rounded bg-[var(--card-background)] outline-none"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-[var(--card-background)] outline-none"
          />
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-[var(--card-background)] outline-none"
          />
        </div>

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full p-3 rounded bg-[var(--card-background)]"
        >
          <option value="upcoming">Upcoming</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>

        <label className="block text-sm font-semibold text-white">
          Tournament Banner
        </label>
        <label
          htmlFor="imageUpload"
          className="w-full flex flex-col items-center justify-center gap-3 px-6 py-8 rounded-xl cursor-pointer border-2 border-dashed border-[var(--accent-color)] bg-[var(--card-bg)] text-white text-center"
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

        {previewUrl && (
          <img
            src={previewUrl}
            alt="Banner Preview"
            className="mt-4 w-full max-h-64 object-cover rounded-lg"
          />
        )}

        {/* add games */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Game Fields</h3>
            <button
              type="button"
              onClick={handleAddGameFields}
              className="text-sm px-3 py-1 bg-green-600 rounded hover:bg-green-700"
            >
              Add Game
            </button>
          </div>

          {gameFields.map((field, index) => (
            <div
              key={index}
              className="bg-[var(--card-background)] p-4 rounded-md space-y-3 relative"
            >
              <button
                type="button"
                onClick={() => handleRemoveGameField(index)}
                className="absolute top-2 right-2 text-red-500 cursor-pointer"
              >
                <X size={24} />
              </button>

              <select
                value={field.game}
                onChange={(e) =>
                  handleGameFieldChange(index, "game", e.target.value)
                }
                className="w-full mt-5 p-2 rounded  bg-[var(--background)] text-white focus:outline-none"
              >
                <option className="bg-[var(--background)]" value="">
                  Select Game
                </option>
                {gamesList.map((game) => (
                  <option
                    className="bg-[var(--background)]"
                    key={game._id}
                    value={game._id}
                  >
                    {game.name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Entry Fee"
                value={field.entryFee}
                onChange={(e) =>
                  handleGameFieldChange(index, "entryFee", e.target.value)
                }
                className="w-full p-2 rounded  bg-[var(--background)] text-white focus:outline-none"
              />

              <input
                type="text"
                placeholder="Format"
                value={field.format}
                readOnly
                className="w-full p-2 rounded  bg-[var(--background)] text-white focus:outline-none"
              />

              <label className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  checked={field.teamBased}
                  onChange={(e) =>
                    handleGameFieldChange(index, "teamBased", e.target.checked)
                  }
                />
                Team Based?
              </label>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Min Players"
                  value={field.minPlayers}
                  onChange={(e) =>
                    handleGameFieldChange(index, "minPlayers", e.target.value)
                  }
                  className="w-full p-2 rounded  bg-[var(--background)] text-white focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Max Players"
                  value={field.maxPlayers}
                  onChange={(e) =>
                    handleGameFieldChange(index, "maxPlayers", e.target.value)
                  }
                  className="w-full p-2 rounded  bg-[var(--background)] text-white focus:outline-none"
                />
              </div>

              {field.gameConfigId && (
                <button
                  type="button"
                  onClick={() =>
                    updateTournamentGame(field.gameConfigId, {
                      game: field.game,
                      entryFee: field.entryFee,
                      format: field.format,
                      teamBased: field.teamBased,
                      minPlayers: field.minPlayers,
                      maxPlayers: field.maxPlayers,
                    })
                  }
                  className="bg-[var(--accent-color)] px-3 py-1 mt-2 rounded text-black text-sm"
                >
                  Update Game
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-[var(--accent-color)] w-full text-[var(--background)] font-medium px-4 py-3 rounded hover:opacity-90"
        >
          {loading
            ? "Saving..."
            : initialData
              ? "Update Tournament"
              : "Create Tournament"}
        </button>
      </form>
    </div>
  );
}
