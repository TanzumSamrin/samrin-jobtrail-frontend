import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { registerUser } from "../api/auth";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

    const errors = {};

    if (!formData.username.trim()) {
      errors.username = "Username is required.";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required.";
    }

    if (!formData.password) {
      errors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      errors.password =
        "Password must be at least 6 characters.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      setLoading(true);

      await registerUser(formData);

      navigate("/login", {
        replace: true,
        state: {
          message:
            "Registration successful. Please login.",
        },
      });
    } catch (error) {
      const responseData = error.response?.data;

      if (responseData) {
        setFieldErrors(responseData);
      } else {
        setError(
          "Unable to connect to the server."
        );
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
            Build momentum
          </span>
          <h2>Turn your job search into a plan.</h2>
          <p>
            Create your account and organize every
            opportunity with clarity, focus, and confidence.
          </p>

          <ul className="auth-points">
            <li>Track interviews and follow-ups</li>
            <li>Keep notes on each role</li>
            <li>Stay ahead of every deadline</li>
          </ul>
        </div>

        <div className="auth-form-panel">
          <div className="auth-header">
            <span className="auth-brand">JobTrail</span>
            <h1>Create account</h1>
            <p>Start tracking your applications today.</p>
          </div>

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
                placeholder="Choose a username"
              />
              {fieldErrors.username && (
                <p className="auth-field-error">
                  {fieldErrors.username}
                </p>
              )}
            </div>

            <div className="auth-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                placeholder="Enter your email"
              />
              {fieldErrors.email && (
                <p className="auth-field-error">
                  {fieldErrors.email}
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
                autoComplete="new-password"
                placeholder="Create a password"
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
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{" "}
            <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;