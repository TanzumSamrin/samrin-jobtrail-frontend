import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

import { loginUser } from "../api/auth";
import { useAuth } from "../auth/AuthContext";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const registerMessage = location.state?.message;

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setFieldErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setFieldErrors({});

    if (!formData.username.trim()) {
      setFieldErrors({
        username: "Username is required.",
      });
      return;
    }

    if (!formData.password) {
      setFieldErrors({
        password: "Password is required.",
      });
      return;
    }

    try {
      setLoading(true);

      const data = await loginUser(formData);

      login(
        data.access,
        data.refresh,
        formData.username
      );

      navigate("/", { replace: true });
    } catch (error) {
      const responseData = error.response?.data;

      if (responseData) {
        setFieldErrors(responseData);
      }

      if (
        responseData?.detail ===
        "No active account found with the given credentials"
      ) {
        setError(
          "Invalid username or password."
        );
      } else if (!responseData) {
        setError(
          "Unable to connect to the server."
        );
      } else if (responseData?.detail) {
        setError(responseData.detail);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-visual">
          <span className="auth-badge">
            Track smarter
          </span>
          <h2>Stay on top of every opportunity.</h2>
          <p>
            Organize your applications, track progress,
            and move faster toward the role you want.
          </p>

          <ul className="auth-points">
            <li>Track every application in one place</li>
            <li>See what stage each job is in</li>
            <li>Keep your search organized and focused</li>
          </ul>
        </div>

        <div className="auth-form-panel">
          <div className="auth-header">
            <span className="auth-brand">JobTrail</span>
            <h1>Welcome back</h1>
            <p>Sign in to continue your job search.</p>
          </div>

          {registerMessage && (
            <div className="auth-success-banner">
              {registerMessage}
            </div>
          )}

          {error && (
            <div className="auth-error-banner">{error}</div>
          )}

          <form
            className="auth-form"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="auth-field">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                autoComplete="username"
                placeholder="Enter your username"
              />
              {fieldErrors.username && (
                <p className="auth-field-error">
                  {fieldErrors.username}
                </p>
              )}
            </div>

            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                placeholder="Enter your password"
              />
              {fieldErrors.password && (
                <p className="auth-field-error">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <button
              className="auth-submit"
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="auth-switch">
            Don&apos;t have an account?{" "}
            <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;