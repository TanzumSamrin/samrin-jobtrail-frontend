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
    <div>
      <h1>Login</h1>

      {registerMessage && (
        <p>{registerMessage}</p>
      )}

      {error && (
        <p>{error}</p>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">
            Username
          </label>

          <input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            autoComplete="username"
          />

          {fieldErrors.username && (
            <p>{fieldErrors.username}</p>
          )}
        </div>

        <div>
          <label htmlFor="password">
            Password
          </label>

          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
          />

          {fieldErrors.password && (
            <p>{fieldErrors.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p>
        Don't have an account?{" "}
        <Link to="/register">
          Register
        </Link>
      </p>
    </div>
  );
}

export default Login;