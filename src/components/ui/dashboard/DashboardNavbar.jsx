import { Menu } from "lucide-react";

export default function DashboardNavbar({ onMenuClick }) {
  return (
    <header
      className="sticky top-0 z-30 w-full h-16 flex items-center justify-between px-6 bg-background"
      style={{ borderBottom: "1px solid var(--card-background)" }}
    >
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button className="lg:hidden" onClick={onMenuClick}>
          <Menu size={24} />
        </button>

        <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
      </div>

      <div className="text-sm text-muted-foreground">Hello, Rohan</div>
    </header>
  );
}
