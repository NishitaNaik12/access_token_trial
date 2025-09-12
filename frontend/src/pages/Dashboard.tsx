import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import placeholderImage from "./blank-profile-picture-973460_1280.png";

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const location = useLocation();

  useEffect(() => {
    // Get token from URL
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get("token");
    if (tokenFromUrl) {
      localStorage.setItem("jwt", tokenFromUrl);
      window.history.replaceState({}, document.title, "/dashboard"); // clean URL
    }

    const token = localStorage.getItem("jwt");
    if (token) {
      axios
        .get("http://localhost:5000/auth/user", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUser(res.data))
        .catch(() => setUser(null));
    }
  }, [location]);

  if (!user) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <p>Please login first</p>
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        background: "#f4f6f9",
        minHeight: "100vh",
      }}
    >
      {/* Navbar */}
      <header
        style={{
          background: "#1e00ffff",
          color: "#fff",
          padding: "15px 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "22px" }}>My Dashboard</h1>
        <button
          onClick={() => {
            localStorage.removeItem("jwt");
            window.location.href = "/login";
          }}
          style={{
            padding: "8px 16px",
            backgroundColor: "#ff4b5c",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Logout
        </button>
      </header>

      {/* Profile Card */}
      <main style={{ padding: "30px", textAlign: "center" }}>
        <div
          style={{
            maxWidth: "400px",
            margin: "0 auto",
            background: "white",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <img
            src={user.picture || placeholderImage}
            alt="Profile"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = placeholderImage;
            }}
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              border: "3px solid #007bff",
              marginBottom: "15px",
              objectFit: "cover",
            }}
          />

          <h2 style={{ margin: "10px 0", color: "#333" }}>
            Welcome, {user.name || "User"}
          </h2>
          <p style={{ color: "#555" }}>{user.email || "No email"}</p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
