import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    axios.get("http://localhost:5000/auth/user", { withCredentials: true })
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  if (!user) {
    return <p>Please login first</p>;
  }

  return (
    <div>
      <h2>Welcome {user.name}</h2>
      <img src={user.picture} alt="profile" />
      <p>Email: {user.email}</p>
      <button onClick={() => window.open("http://localhost:5000/auth/logout", "_self")}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
