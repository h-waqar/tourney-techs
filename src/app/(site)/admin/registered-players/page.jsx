"use client";
import { useState } from "react";

export default function RegisteredPlayers() {
  const [players, setPlayers] = useState([
    {
      id: 1,
      tournament: "Tournament Weekend",
      startDate: "8/28/2025",
      endDate: "8/30/2025",
      status: "Upcoming",
      name: "testuser",
      email: "testuser@gmail.com",
      city: "Lahore",
      country: "Pakistan",
      game: "PUBG",
      fee: "20",
      paymentApproved: false,
    },
  ]);

  const togglePayment = (id) => {
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, paymentApproved: !p.paymentApproved } : p
      )
    );
  };

  return (
    <div
      className="p-6 min-h-screen"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      <h1 className="text-2xl font-bold mb-6">Registered Players</h1>

      {/* Desktop Table */}
      <div className="overflow-x-auto rounded-lg shadow-md scrollbar-x">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead
            style={{
              background: "var(--card-background)",
              color: "var(--foreground)",
            }}
          >
            <tr>
              <th className="px-4 py-3 whitespace-nowrap">Tournament</th>
              <th className="px-4 py-3 whitespace-nowrap">Start Date</th>
              <th className="px-4 py-3 whitespace-nowrap">End Date</th>
              <th className="px-4 py-3 whitespace-nowrap">Status</th>
              <th className="px-4 py-3 whitespace-nowrap">Player</th>
              <th className="px-4 py-3 whitespace-nowrap">Email</th>
              <th className="px-4 py-3 whitespace-nowrap">City</th>
              <th className="px-4 py-3 whitespace-nowrap">Country</th>
              <th className="px-4 py-3 whitespace-nowrap">Game</th>
              <th className="px-4 py-3 whitespace-nowrap">Fee</th>
              <th className="px-4 py-3 whitespace-nowrap">Payment Approved</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr
                key={player.id}
                className="transition"
                style={{ borderBottom: "1px solid var(--border-color)" }}
              >
                <td className="px-4 py-3 font-medium">{player.tournament}</td>
                <td className="px-4 py-3">{player.startDate}</td>
                <td className="px-4 py-3">{player.endDate}</td>
                <td
                  className="px-4 py-3 font-semibold"
                  style={{
                    color:
                      player.status === "Upcoming"
                        ? "var(--success-color)"
                        : "var(--error-color)",
                  }}
                >
                  {player.status}
                </td>
                <td className="px-4 py-3">{player.name}</td>
                <td className="px-4 py-3">{player.email}</td>
                <td className="px-4 py-3">{player.city}</td>
                <td className="px-4 py-3">{player.country}</td>
                <td className="px-4 py-3">{player.game}</td>
                <td className="px-4 py-3">${player.fee}</td>
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={player.paymentApproved}
                    onChange={() => togglePayment(player.id)}
                    className="w-5 h-5 cursor-pointer"
                    style={{
                      accentColor: "var(--accent-color)",
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile-Friendly Cards */}
      <div className="mt-6 grid gap-4 sm:hidden">
        {players.map((player) => (
          <div
            key={player.id}
            className="p-4 rounded-lg shadow-md"
            style={{
              background: "var(--card-background)",
              border: "1px solid var(--border-color)",
            }}
          >
            <h2 className="font-bold mb-2">{player.name}</h2>
            <p className="text-sm">
              <span className="font-semibold">Tournament:</span>{" "}
              {player.tournament}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Date:</span> {player.date}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Status:</span>{" "}
              <span
                style={{
                  color:
                    player.status === "Upcoming"
                      ? "var(--success-color)"
                      : "var(--error-color)",
                }}
              >
                {player.status}
              </span>
            </p>
            <p className="text-sm">
              <span className="font-semibold">Email:</span> {player.email}
            </p>
            <p className="text-sm">
              <span className="font-semibold">City:</span> {player.city},{" "}
              {player.country}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Game:</span> {player.game} ($
              {player.fee})
            </p>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="checkbox"
                checked={player.paymentApproved}
                onChange={() => togglePayment(player.id)}
                className="w-5 h-5 cursor-pointer"
                style={{ accentColor: "var(--accent-color)" }}
              />
              <span className="text-sm">Payment Approved</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
