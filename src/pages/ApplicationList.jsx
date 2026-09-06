import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import { useEffect, useState } from "react";
import {
  Link,
  useSearchParams,
} from "react-router-dom";

import {
  deleteApplication,
  getApplications,
} from "../api/applications";

import ConfirmModal from "../components/ConfirmModal";

function ApplicationList() {
  const [searchParams, setSearchParams] =
    useSearchParams();

  const search =
    searchParams.get("search") || "";

  const status =
    searchParams.get("status") || "";

  const page =
    Number(searchParams.get("page")) || 1;

  const [applications, setApplications] =
    useState([]);

  const [searchInput, setSearchInput] =
    useState(search);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [nextPage, setNextPage] =
    useState(null);

  const [previousPage, setPreviousPage] =
    useState(null);

  const [totalCount, setTotalCount] =
    useState(0);

  const [deleteTarget, setDeleteTarget] =
    useState(null);

  const [deleteLoading, setDeleteLoading] =
    useState(false);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getApplications({
        search: search || undefined,
        status: status || undefined,
        page,
      });

      setApplications(data.results);
      setNextPage(data.next);
      setPreviousPage(data.previous);
      setTotalCount(data.count);
    } catch (error) {
      setError(
        "Failed to load applications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [search, status, page]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const params = {};

    if (searchInput.trim()) {
      params.search = searchInput.trim();
    }

    if (status) {
      params.status = status;
    }

    params.page = 1;

    setSearchParams(params);
  };

  const handleStatusChange = (event) => {
    const newStatus = event.target.value;

    const params = {
      page: 1,
    };

    if (search) {
      params.search = search;
    }

    if (newStatus) {
      params.status = newStatus;
    }

    setSearchParams(params);
  };

  const goToNextPage = () => {
    if (!nextPage) {
      return;
    }

    const nextUrl = new URL(nextPage);

    const nextPageNumber =
      nextUrl.searchParams.get("page");

    const params = {};

    if (search) {
      params.search = search;
    }

    if (status) {
      params.status = status;
    }

    params.page = nextPageNumber;

    setSearchParams(params);
  };

  const goToPreviousPage = () => {
    if (!previousPage) {
      return;
    }

    const previousUrl =
      new URL(previousPage);

    const previousPageNumber =
      previousUrl.searchParams.get("page");

    const params = {};

    if (search) {
      params.search = search;
    }

    if (status) {
      params.status = status;
    }

    params.page = previousPageNumber;

    setSearchParams(params);
  };

  const handleDeleteClick = (application) => {
    setDeleteTarget(application);
  };

  const handleCancelDelete = () => {
    if (!deleteLoading) {
      setDeleteTarget(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      setDeleteLoading(true);

      await deleteApplication(
        deleteTarget.id
      );

      const remainingApplications =
        applications.filter(
          (application) =>
            application.id !==
            deleteTarget.id
        );

      setDeleteTarget(null);

      // Current page still has other items.
      if (remainingApplications.length > 0) {
        setApplications(
          remainingApplications
        );
        setTotalCount(
          (previous) => previous - 1
        );
        return;
      }

      // Current page became empty.
      if (page > 1) {
        const params = {};

        if (search) {
          params.search = search;
        }

        if (status) {
          params.status = status;
        }

        params.page = page - 1;

        setSearchParams(params);
      } else {
        setApplications([]);
        setTotalCount(
          (previous) => previous - 1
        );
      }
    } catch (error) {
      setError(
        "Failed to delete application."
      );
      setDeleteTarget(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div>
      <h1>My Applications</h1>

      <Link to="/applications/new">
        Add Application
      </Link>

      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Search company or position..."
          value={searchInput}
          onChange={(event) =>
            setSearchInput(event.target.value)
          }
        />

        <button type="submit">
          Search
        </button>
      </form>

      <select
        value={status}
        onChange={handleStatusChange}
      >
        <option value="">
          All Statuses
        </option>

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

      {loading && (
          <Loader message="Loading applications..." />
        
      )}

      {error && (
        <ErrorState
          message={error}
          onRetry={fetchApplications}
        />
      )}

      {!loading &&
        !error &&
         applications.length === 0 && (
          <EmptyState
            message={
             search || status
              ? "No applications match your filters."
              : "You have not added any applications yet."
          }
        />
      )}

      {!loading &&
        !error &&
        applications.length > 0 && (
          <>
            <p>
              Total Applications:{" "}
              {totalCount}
            </p>

            <div>
              {applications.map(
                (application) => (
                  <div
                    key={application.id}
                  >
                    <h3>
                      {application.position}
                    </h3>

                    <p>
                      Company:{" "}
                      {application.company}
                    </p>

                    <p>
                      Status:{" "}
                      {application.status}
                    </p>

                    <p>
                      Job Type:{" "}
                      {application.job_type}
                    </p>

                    <p>
                      Applied On:{" "}
                      {application.applied_on ||
                        "Not specified"}
                    </p>

                    <Link
                      to={`/applications/${application.id}/edit`}
                    >
                      Edit
                    </Link>

                    {" "}

                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteClick(
                          application
                        )
                      }
                    >
                      Delete
                    </button>
                  </div>
                )
              )}
            </div>
          </>
        )}

      {!loading && !error && (
        <div>
          <button
            onClick={goToPreviousPage}
            disabled={!previousPage}
          >
            Previous
          </button>

          <span>
            {" "}
            Page {page}{" "}
          </span>

          <button
            onClick={goToNextPage}
            disabled={!nextPage}
          >
            Next
          </button>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Application"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.position}" at "${deleteTarget.company}"?`
            : ""
        }
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        loading={deleteLoading}
      />
    </div>
  );
}

export default ApplicationList;