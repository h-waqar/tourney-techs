"use client";

export default function TournamentGameList({ games }) {
  return (
    <div className="col-span-2">
      <p className="font-semibold">🎮 Games:</p>
      <ul className="list-disc ml-5 text-sm space-y-1">
        {games.map((game, i) => (
          <li key={i}>
            <strong>{game.name}</strong> — {game.registrationFee} •{" "}
            {game.type === "team" ? `Team of ${game.teamSize}` : "Single Player"}
          </li>
        ))}
      </ul>
    </div>
  );
}
