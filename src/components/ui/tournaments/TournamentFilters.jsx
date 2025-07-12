export default function TournamentFilters({
  filters,
  onChange,
  search,
  onSearchChange,
  tournamentData,
}) {
  const uniqueLocations = [...new Set(tournamentData.map((t) => t.location))].sort();

  const uniqueGames = [
    ...new Set(
      tournamentData.flatMap((t) =>
        Array.isArray(t.games) ? t.games.map((g) => g.name) : []
      )
    ),
  ].sort();

  const selectClass =
    "p-2 rounded border border-[var(--border-color)] bg-[var(--card-background)] text-[var(--foreground)]";

  const optionStyle = {
    backgroundColor: "var(--card-background)",
    color: "var(--foreground)",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-10">
      {/* Search bar */}
      <input
        type="text"
        placeholder="Search by tournament name..."
        className="p-2 rounded border border-[var(--border-color)] bg-[var(--card-background)] text-[var(--foreground)]"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      {/* Status filter */}
      <select
        name="status"
        value={filters.status}
        onChange={onChange}
        className={selectClass}
      >
        <option value="" style={optionStyle}>All Status</option>
        <option value="upcoming" style={optionStyle}>Upcoming</option>
        <option value="ongoing" style={optionStyle}>Ongoing</option>
        <option value="complete" style={optionStyle}>Complete</option>
      </select>

      {/* Location filter */}
      <select
        name="location"
        value={filters.location}
        onChange={onChange}
        className={selectClass}
      >
        <option value="" style={optionStyle}>All Locations</option>
        {uniqueLocations.map((loc) => (
          <option key={loc} value={loc} style={optionStyle}>
            {loc}
          </option>
        ))}
      </select>

      {/* Type filter */}
      <select
        name="type"
        value={filters.type}
        onChange={onChange}
        className={selectClass}
      >
        <option value="" style={optionStyle}>All Types</option>
        <option value="single" style={optionStyle}>Single</option>
        <option value="team" style={optionStyle}>Team</option>
      </select>

      {/* Game filter */}
      <select
        name="game"
        value={filters.game}
        onChange={onChange}
        className={selectClass}
      >
        <option value="" style={optionStyle}>All Games</option>
        {uniqueGames.map((game) => (
          <option key={game} value={game} style={optionStyle}>
            {game}
          </option>
        ))}
      </select>
    </div>
  );
}
