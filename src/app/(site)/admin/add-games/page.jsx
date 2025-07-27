
"use client";
import { useState, useEffect } from "react";
import api from "@/utils/axios";
import GameForm from "@/components/ui/admin/games/GameForm";
import GamesTable from "@/components/ui/admin/games/GameTable";

export default function GamesPage() {
  const [games, setGames] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editGame, setEditGame] = useState(null);

  const fetchGames = async () => {
    try {
      const res = await api.get("/api/games");
      setGames(res.data.data);
    } catch (err) {
      console.error("Failed to fetch games", err);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const handleAddOrUpdate = async (data) => {
    try {
      if (editGame) {
        // Add PUT logic if you have update route
        console.warn("Update API route not implemented.");
      } else {
        const res = await api.post("/api/games", data);
        if (res.status === 201) {
          fetchGames();
        }
      }
    } catch (err) {
      console.error("Game save failed", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      // Add DELETE route if needed
      console.warn("Delete API route not implemented.");
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="min-h-screen p-6 ">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-[color:var(--accent-color)]">Games</h1>
          <button onClick={() => {
            setEditGame(null);
            setShowForm((prev) => !prev);
          }} className="bg-[color:var(--accent-color)] hover:opacity-90 text-white px-4 py-2 rounded">
            {showForm ? "Close" : "Add Game"}
          </button>
        </div>

        {showForm && (
          <GameForm
            onSubmit={handleAddOrUpdate}
            initialData={editGame}
            onClose={() => setShowForm(false)}
          />
        )}

        <div className="mt-6">
          <GamesTable games={games} onEdit={(game) => {
            setEditGame(game);
            setShowForm(true);
          }} onDelete={handleDelete} />
        </div>
      </div>
    </div>
  );
}
