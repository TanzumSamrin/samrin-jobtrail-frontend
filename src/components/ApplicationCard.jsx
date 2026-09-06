import { Link } from "react-router-dom";

function ApplicationCard({ application, onDelete }) {
  return (
    <div className="application-card">
      <div className="application-card-header">
        <div>
          <h3>{application.position}</h3>
          <p className="company-name">{application.company}</p>
        </div>

        <span
          className={`status-badge status-${application.status.toLowerCase()}`}
        >
          {application.status}
        </span>
      </div>

      <div className="application-details">
        <p>
          <strong>Job Type:</strong> {application.job_type}
        </p>

        <p>
          <strong>Applied:</strong>{" "}
          {application.applied_on || "Not specified"}
        </p>

        <p>
          <strong>Expected Salary:</strong>{" "}
          {application.expected_salary
            ? application.expected_salary.toLocaleString()
            : "Not specified"}
        </p>
      </div>

      <div className="application-actions">
        <Link
          to={`/applications/${application.id}/edit`}
          className="btn btn-secondary"
        >
          Edit
        </Link>

        <button
          onClick={() => onDelete(application)}
          className="btn btn-danger"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default ApplicationCard;