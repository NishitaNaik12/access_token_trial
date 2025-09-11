import React from "react";
import "../Login.css";

const Login: React.FC = () => {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Welcome Back </h1>
        <p>Sign in to continue</p>

        <button className="google-btn" onClick={handleGoogleLogin}>
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            style={{ width: "24px", height: "24px" }}
          />
          Continue with Google
        </button>

        <div className="divider">
          <hr />
          <span>or</span>
          <hr />
        </div>

        <button className="email-btn">Continue with Email</button>

        <p>
          Don’t have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
