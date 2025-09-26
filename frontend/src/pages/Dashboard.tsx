import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  Home,
  BarChart2,
  Settings,
  LogOut,
  User,
  MessageCircle,
  Smile,
  Frown,
} from "lucide-react";
import placeholderImage from "./blank-profile-picture-973460_1280.png";
import useCSV from "../hooks/useCSV";

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const location = useLocation();

  // Load dataset
  const tweets = useCSV("/Tweets.csv");

  const sentimentCounts = tweets.reduce(
    (acc: any, row: any) => {
      const sentiment = row.airline_sentiment;
      if (sentiment) acc[sentiment] = (acc[sentiment] || 0) + 1;
      return acc;
    },
    { positive: 0, neutral: 0, negative: 0 }
  );

  const pieData = Object.entries(sentimentCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const colors = ["#22c55e", "#3b82f6", "#ef4444"]; // positive, neutral, negative
  const totalTweets = tweets.length;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get("token");
    if (tokenFromUrl) {
      localStorage.setItem("jwt", tokenFromUrl);
      window.history.replaceState({}, document.title, "/dashboard");
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
      <div style={{ textAlign: "center", marginTop: "50px", color: "#e2e8f0" }}>
        <p>Please login first</p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "Inter, sans-serif",
        background: "#0f172a",
        color: "#e2e8f0",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: "220px",
          background: "#1e293b",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h2 style={{ color: "#f9fafb", marginBottom: "30px" }}>
            ✈️ Analytics
          </h2>
          <nav
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {[
              {
                icon: <Home size={18} />,
                label: "Dashboard",
                link: "#dashboard",
              },
              {
                icon: <BarChart2 size={18} />,
                label: "Analytics",
                link: "#analytics",
              },
              {
                icon: <Settings size={18} />,
                label: "Settings",
                link: "#settings",
              },
            ].map((item, i) => (
              <a
                key={i}
                href={item.link}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  color: "#e2e8f0",
                  textDecoration: "none",
                  transition: "background 0.2s",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "rgba(59,130,246,0.2)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                {item.icon} {item.label}
              </a>
            ))}
          </nav>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("jwt");
            window.location.href = "/login";
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "transparent",
            border: "none",
            color: "#ef4444",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Navbar */}
        <header
          style={{
            background: "#1e293b",
            padding: "15px 30px",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.6)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <User size={20} />
            <span>{user.name}</span>
            <img
              src={user.picture || placeholderImage}
              alt="profile"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #3b82f6",
              }}
            />
          </div>
        </header>

        {/* Dashboard Content */}
        <main style={{ padding: "30px", flex: 1 }}>
          <h1
            style={{ marginBottom: "30px", fontSize: "26px", fontWeight: 600 }}
          >
            Twitter Airline Sentiment
          </h1>

          {/* KPIs */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "20px",
              marginBottom: "40px",
            }}
          >
            {[
              {
                label: "Total Tweets",
                value: totalTweets.toLocaleString(),
                icon: <MessageCircle />,
              },
              {
                label: "Positive %",
                value:
                  ((sentimentCounts.positive / totalTweets) * 100).toFixed(1) +
                  "%",
                icon: <Smile />,
              },
              {
                label: "Negative %",
                value:
                  ((sentimentCounts.negative / totalTweets) * 100).toFixed(1) +
                  "%",
                icon: <Frown />,
              },
            ].map((kpi, i) => (
              <div
                key={i}
                style={{
                  background: "#1e293b",
                  padding: "20px",
                  borderRadius: "12px",
                  boxShadow: "0px 4px 12px rgba(0,0,0,0.5)",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  {kpi.icon}
                </div>
                <h3 style={{ marginBottom: "6px", color: "#cbd5e1" }}>
                  {kpi.label}
                </h3>
                <p
                  style={{
                    fontSize: "22px",
                    fontWeight: 700,
                    color: "#f9fafb",
                  }}
                >
                  {kpi.value}
                </p>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "40px",
            }}
          >
            {/* Pie Chart */}
            <div
              style={{
                background: "#1e293b",
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0px 4px 12px rgba(0,0,0,0.5)",
              }}
            >
              <h3 style={{ marginBottom: "15px", color: "#cbd5e1" }}>
                Sentiment Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={colors[index % colors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      color: "#f9fafb",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div
              style={{
                background: "#1e293b",
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0px 4px 12px rgba(0,0,0,0.5)",
              }}
            >
              <h3 style={{ marginBottom: "15px", color: "#cbd5e1" }}>
                Sentiment Counts
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pieData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#cbd5e1" />
                  <YAxis stroke="#cbd5e1" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      color: "#f9fafb",
                    }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </main>

        {/* --- NEW SECTION: Python EDA + Network Graphs --- */}
        <div
          style={{
            marginTop: "40px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "40px",
          }}
        >
          {/* EDA Graphs */}
          <div
            style={{
              background: "#1e293b",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.5)",
            }}
          >
            <h3 style={{ marginBottom: "15px", color: "#cbd5e1" }}>
              EDA Graphs
            </h3>
            <img
              src="/eda.png"
              alt="EDA Results"
              style={{ width: "100%", borderRadius: "8px" }}
            />
          </div>

          {/* Network Graph */}
          <div
            style={{
              background: "#1e293b",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.5)",
            }}
          >
            <h3 style={{ marginBottom: "15px", color: "#cbd5e1" }}>
              Network Graph
            </h3>
            <img
              src="/negative_network.png"
              alt="Network Graph"
              style={{ width: "100%", borderRadius: "8px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
