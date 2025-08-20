"use client";
import { useState } from "react";
import toast from "react-hot-toast";
export default function TournamentRegistration() {
  const [formData, setFormData] = useState({
    user: "",
    password: "",
    game: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    // Later hook up API
  };

  return (
    <div
      className="max-w-lg mx-auto rounded-2xl p-8 shadow-lg border"
      style={{
        background: "var(--card-background)",
        borderColor: "var(--border-color)",
      }}
    >
      <h2
        className="text-2xl font-bold text-center mb-6"
        style={{ color: "var(--accent-color)" }}
      >
        Tournament Registration
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Select User */}
        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: "var(--foreground)" }}
          >
            Select User
          </label>
          <select
            name="user"
            value={formData.user}
            onChange={handleChange}
            className="w-full rounded-lg px-3 py-2"
            style={{
              background: "var(--secondary-color)",
              borderColor: "var(--border-color)",
              color: "var(--foreground)",
            }}
            required
          >
            <option value="">-- Select User --</option>
            <option value="user1">testuser</option>
            <option value="user2">dev</option>
            <option value="user2">abdullah</option>
            <option value="user2">test1</option>
            <option value="user2">test2</option>
          </select>
        </div>

        {/* Password Field */}
        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: "var(--foreground)" }}
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            className="w-full rounded-lg px-3 py-2"
            style={{
              background: "var(--secondary-color)",
              borderColor: "var(--border-color)",
              color: "var(--foreground)",
            }}
            required
          />
        </div>

        {/* Select Game */}
        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: "var(--foreground)" }}
          >
            Select Game
          </label>
          <select
            name="game"
            value={formData.game}
            onChange={handleChange}
            className="w-full rounded-lg px-3 py-2"
            style={{
              background: "var(--secondary-color)",
              borderColor: "var(--border-color)",
              color: "var(--foreground)",
            }}
            required
          >
            <option value="">-- Select Game --</option>
            <option value="game1">Pubg  Price= 20</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200"
          style={{
            background: "var(--accent-color)",
            color: "black",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.background = "var(--accent-hover)")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.background = "var(--accent-color)")
          }
          onClick={(e) =>{
            e.currentTarget.innerHTML = "Pending ...";
            toast.success("Your are registered successfully. Wait for admin approval")
          }}
        >
          Register
        </button>
      </form>
    </div>
  );
}
