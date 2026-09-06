import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  createApplication,
  getApplication,
  updateApplication,
} from "../api/applications";

const initialForm = {
  company: "",
  position: "",
  status: "WISHLIST",
  job_type: "ONSITE",
  applied_on: "",
  expected_salary: "",
  job_link: "",
  notes: "",
};

function ApplicationForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEditMode = Boolean(id);

  const [formData, setFormData] =
    useState(initialForm);

  const [loading, setLoading] =
    useState(isEditMode);

  const [saving, setSaving] =
    useState(false);

  const [errors, setErrors] =
    useState({});

  const [generalError, setGeneralError] =
    useState("");

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const fetchApplication = async () => {
      try {
        setLoading(true);

        const data = await getApplication(id);

        setFormData({
          company: data.company || "",
          position: data.position || "",
          status: data.status || "WISHLIST",
          job_type: data.job_type || "ONSITE",
          applied_on: data.applied_on || "",
          expected_salary:
            data.expected_salary ?? "",
          job_link: data.job_link || "",
          notes: data.notes || "",
        });
      } catch (error) {
        setGeneralError(
          "Failed to load application."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id, isEditMode]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setGeneralError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrors({});
    setGeneralError("");

    const clientErrors = {};

    if (!formData.company.trim()) {
      clientErrors.company =
        "Company is required.";
    }

    if (!formData.position.trim()) {
      clientErrors.position =
        "Position is required.";
    }

    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    const payload = {
      ...formData,
      company: formData.company.trim(),
      position: formData.position.trim(),
    };

    if (payload.expected_salary === "") {
      payload.expected_salary = null;
    }

    if (payload.applied_on === "") {
      payload.applied_on = null;
    }

    try {
      setSaving(true);

      if (isEditMode) {
        await updateApplication(id, payload);
      } else {
        await createApplication(payload);
      }

      navigate("/applications", {
        replace: true,
        state: {
          message: isEditMode
            ? "Application updated successfully."
            : "Application created successfully.",
        },
      });
    } catch (error) {
      const responseData =
        error.response?.data;

      if (responseData) {
        setErrors(responseData);
      } else {
        setGeneralError(
          "Unable to connect to the server."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="application-form-shell">
          <div className="application-form-card loading-card">
            <p>Loading application...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="application-form-shell">
        <div className="application-form-card">
          <div className="application-form-header">
            <div>
              <span className="form-tag">
                {isEditMode ? "Update" : "New"}
              </span>
              <h1>
                {isEditMode
                  ? "Edit Application"
                  : "Add Application"}
              </h1>
            </div>
            <p>
              Capture the role details and keep your job search organized.
            </p>
          </div>

          {generalError && (
            <div className="auth-error-banner application-form-alert">
              {generalError}
            </div>
          )}

          <form
            className="application-form"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="company">Company *</label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Google"
                />
                {errors.company && (
                  <p className="field-error">{errors.company}</p>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="position">Position *</label>
                <input
                  id="position"
                  name="position"
                  type="text"
                  value={formData.position}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Frontend Engineer"
                />
                {errors.position && (
                  <p className="field-error">{errors.position}</p>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="WISHLIST">Wishlist</option>
                  <option value="APPLIED">Applied</option>
                  <option value="INTERVIEW">Interview</option>
                  <option value="OFFER">Offer</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="job_type">Job Type</label>
                <select
                  id="job_type"
                  name="job_type"
                  value={formData.job_type}
                  onChange={handleChange}
                >
                  <option value="ONSITE">Onsite</option>
                  <option value="REMOTE">Remote</option>
                  <option value="HYBRID">Hybrid</option>
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="applied_on">Applied On</label>
                <input
                  id="applied_on"
                  name="applied_on"
                  type="date"
                  value={formData.applied_on}
                  onChange={handleChange}
                />
                {errors.applied_on && (
                  <p className="field-error">{errors.applied_on}</p>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="expected_salary">Expected Salary</label>
                <input
                  id="expected_salary"
                  name="expected_salary"
                  type="number"
                  min="0"
                  value={formData.expected_salary}
                  onChange={handleChange}
                  placeholder="e.g. 120000"
                />
                {errors.expected_salary && (
                  <p className="field-error">{errors.expected_salary}</p>
                )}
              </div>

              <div className="form-field full-width">
                <label htmlFor="job_link">Job Link</label>
                <input
                  id="job_link"
                  name="job_link"
                  type="url"
                  placeholder="https://example.com/job"
                  value={formData.job_link}
                  onChange={handleChange}
                />
                {errors.job_link && (
                  <p className="field-error">{errors.job_link}</p>
                )}
              </div>

              <div className="form-field full-width">
                <label htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  rows="5"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Add notes about the role, interview process, or follow-up steps..."
                />
                {errors.notes && (
                  <p className="field-error">{errors.notes}</p>
                )}
              </div>
            </div>

            <div className="application-form-actions">
              <button
                className="btn btn-primary"
                type="submit"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : isEditMode
                  ? "Update Application"
                  : "Save Application"}
              </button>

              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => navigate("/applications")}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ApplicationForm;