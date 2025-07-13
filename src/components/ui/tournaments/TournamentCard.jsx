"use client";

import TournamentGameList from "./TournamentGameList";

export default function TournamentCard({
  id,
  title,
  games,
  date,
  time,
  location,
  price,
  image,
  description,
  status,
  selectedId,
  onSelect,
}) {
  const isSelected = selectedId === id;

  const getStatusColor = () => {
    switch (status) {
      case "complete":
        return "var(--error-color)";
      case "ongoing":
        return "var(--success-color)";
      case "upcoming":
        return "var(--info-color)";
      default:
        return "var(--accent-color)";
    }
  };

  return (
    <div
      className="rounded-xl overflow-hidden shadow-lg hover:scale-[1.02] transition-transform border border-gray-700"
      style={{ backgroundColor: "var(--card-background)" }}
    >
      {/* Image */}
      <img src={image} alt={title} className="w-full h-48 object-cover" />

      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold">{title}</h2>
            <span
              className="inline-block mt-1 px-3 py-1 text-xs rounded-full font-semibold"
              style={{
                backgroundColor: getStatusColor(),
                color: "var(--background)",
              }}
            >
              {status.toUpperCase()}
            </span>
          </div>

          <div className="text-right">
            <span
              className="inline-block px-3 py-1 text-sm rounded-full font-medium"
              style={{
                backgroundColor: "var(--accent-color)",
                color: "var(--background)",
              }}
            >
              {price}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-400 text-sm">{description}</p>

        {/* Details */}
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
          <p>
            📍 <strong>{location}</strong>
          </p>
          <p>📅 {date}</p>
          <p>⏰ {time}</p>
          <TournamentGameList games={games} />
        </div>

        {/* Button */}
        <button
          onClick={() => onSelect(id)}
          className="w-full mt-3 py-2 rounded-lg font-semibold transition hover:scale-[1.01]"
          style={{
            backgroundColor: isSelected
              ? "var(--primary-hover)"
              : "var(--accent-color)",
            color: isSelected ? "var(--foreground)" : "var(--background)",
          }}
        >
          {isSelected ? "✔ Entered" : "Enter Tournament"}
        </button>
      </div>
    </div>
  );
}
