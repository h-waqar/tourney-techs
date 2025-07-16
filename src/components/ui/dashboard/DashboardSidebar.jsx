import Link from "next/link";
import { X, LayoutDashboard, Users, Settings, LogOut } from "lucide-react";

import Image from "next/image";

const logo = "/img/logo.jpg";

export default function DashboardSidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Overlay for mobile and tablet */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed z-50 lg:static top-0 left-0 h-full w-64 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        style={{
          backgroundColor: "var(--card-background)",
          color: "var(--foreground)",
        }}
      >
        {/* Header with close button */}
        <div
          className="flex justify-between items-center h-16  px-4 py-4"
          style={{ borderBottom: "1px solid var(--background)" }}
        >
          <div className="flex items-center gap-3">
            <Image
              src={logo}
              alt="Tourney Tech Logo"
              width={30}
              height={30}
              className="rounded-full"
            />
            <h2 className="text-lg font-bold">Tourney Tech</h2>
          </div>
          <button onClick={onClose} className="lg:hidden text-xl">
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-2 py-4 space-y-1">
          <ul>
            <li>
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-4 py-2 rounded hover:bg-[var(--card-hover)] transition"
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
}
