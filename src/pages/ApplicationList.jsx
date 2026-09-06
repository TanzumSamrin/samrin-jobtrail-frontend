import { useEffect, useState } from "react";
import { useSearchParams, Link, useLocation } from "react-router-dom";

import {
  deleteApplication,
  getApplications,
} from "../api/applications";

import ApplicationCard from "../components/ApplicationCard";
import ConfirmModal from "../components/ConfirmModal";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";

function ApplicationList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const page = Number(searchParams.get("page")) || 1;

  const [searchInput, setSearchInput] = useState(search);

  const [applications, setApplications] = useState([]);
  const [count, setCount] = useState(0);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page,
      };

      if (search) {
        params.search = search;
      }

      if (status) {
        params.status = status;
      }

      const data = await getApplications(params);

      setApplications(data.results || []);
      setCount(data.count || 0);
      setNext(data.next);
      setPrevious(data.previous);
    } catch (err) {
      console.error(err);
      setError("Failed to load applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSearchInput(search);
    loadApplications();
  }, [search, status, page]);

  const handleSearch = (e) => {
    e.preventDefault();

    const params = {};

    const trimmedSearch = searchInput.trim();

    if (trimmedSearch) {
      params.search = trimmedSearch;
    }

    if (status) {
      params.status = status;
    }

    params.page = 1;

    setSearchParams(params);
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;

    const params = {};

    if (search) {
      params.search = search;
    }

    if (newStatus) {
      params.status = newStatus;
    }

    params.page = 1;

    setSearchParams(params);
  };

  const handlePageChange = (newPage) => {
    const params = {};

    if (search) {
      params.search = search;
    }

    if (status) {
      params.status = status;
    }

    params.page = newPage;

    setSearchParams(params);
  };

  const handleDeleteClick = (application) => {
    setDeleteTarget(application);
  };

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      setDeleteLoading(true);

      await deleteApplication(deleteTarget.id);

      const remainingApplications = applications.filter(
        (application) => application.id !== deleteTarget.id
      );

      setDeleteTarget(null);

      
      if (remainingApplications.length === 0 && page > 1) {
        handlePageChange(page - 1);
        return;
      }

      setApplications(remainingApplications);
      setCount((currentCount) => Math.max(currentCount - 1, 0));
    } catch (err) {
      console.error(err);
      setError("Failed to delete application.");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="page-container">
        <Loader />
      </main>
    );
  }

  if (error) {
    return (
      <main className="page-container">
        <ErrorState
          message={error}
          onRetry={loadApplications}
        />
      </main>
    );
  }

  return (
    <main className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Applications</h1>

          <p className="page-subtitle">
            Track and manage your job applications.
          </p>
        </div>

        <Link
          to="/applications/new"
          className="btn btn-primary"
        >
          + Add Application
        </Link>
      </div>

      {/* Success Message */}
      {location.state?.message && (
        <div className="success-message">
          {location.state.message}
        </div>
      )}

      {/* Search & Filter */}
      <div className="filter-box">
        <form
          onSubmit={handleSearch}
          className="search-form"
        >
          <input
            type="text"
            placeholder="Search company or position..."
            value={searchInput}
            onChange={(e) =>
              setSearchInput(e.target.value)
            }
          />

          <button
            type="submit"
            className="btn btn-primary"
          >
            Search
          </button>
        </form>

        <select
          value={status}
          onChange={handleStatusChange}
        >
          <option value="">All Statuses</option>

          <option value="WISHLIST">
            Wishlist
          </option>

          <option value="APPLIED">
            Applied
          </option>

          <option value="INTERVIEW">
            Interview
          </option>

          <option value="OFFER">
            Offer
          </option>

          <option value="REJECTED">
            Rejected
          </option>
        </select>
      </div>

      {/* Result Count */}
      <p className="result-count">
        Total applications: <strong>{count}</strong>
      </p>

      {/* Applications */}
      {applications.length === 0 ? (
        search || status ? (
          <EmptyState
            message="No applications match your current filters."
          />
        ) : (
          <EmptyState
            message="No applications found. Add your first application."
          />
        )
      ) : (
        <div className="application-grid">
          {applications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {(next || previous) && (
        <div className="pagination">
          <button
            className="btn btn-secondary"
            disabled={!previous}
            onClick={() =>
              handlePageChange(page - 1)
            }
          >
            Previous
          </button>

          <span>
            Page <strong>{page}</strong>
          </span>

          <button
            className="btn btn-secondary"
            disabled={!next}
            onClick={() =>
              handlePageChange(page + 1)
            }
          >
            Next
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Application"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.position} at ${deleteTarget.company}"?`
            : ""
        }
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </main>
  );
}

export default ApplicationList;