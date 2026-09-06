import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getApplications,
  getStatistics,
} from "../api/applications";

import StatCard from "../components/StatCard";
import ApplicationCard from "../components/ApplicationCard";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";

function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    wishlist: 0,
    applied: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
  });

  const [recentApplications, setRecentApplications] =
    useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [statsData, applicationsData] =
        await Promise.all([
          getStatistics(),

          getApplications({
            ordering: "-created_at",
            page: 1,
          }),
        ]);

      setStats(statsData);

      /*
       * Backend pagination ব্যবহার করছে।
       * তাই প্রথম page-এর সর্বোচ্চ 5টি application নিচ্ছি।
       */
      setRecentApplications(
        (applicationsData.results || []).slice(0, 5)
      );
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

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
          onRetry={loadDashboard}
        />
      </main>
    );
  }

  return (
    <main className="page-container">
      {/* Dashboard Header */}
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>

          <p className="page-subtitle">
            Welcome back! Here's an overview of your
            job applications.
          </p>
        </div>

        <Link
          to="/applications/new"
          className="btn btn-primary"
        >
          + Add Application
        </Link>
      </div>

      {/* Statistics */}
      <section>
        <div className="stats-grid">
          <StatCard
            title="Total"
            value={stats.total}
          />

          <StatCard
            title="Applied"
            value={stats.applied}
          />

          <StatCard
            title="Interviews"
            value={stats.interview}
          />

          <StatCard
            title="Offers"
            value={stats.offer}
          />

          <StatCard
            title="Rejected"
            value={stats.rejected}
          />
        </div>
      </section>

      {/* Recent Applications */}
      <section>
        <div className="page-header">
          <div>
            <h2>Recent Applications</h2>

            <p className="page-subtitle">
              Your five most recently created applications.
            </p>
          </div>

          <Link
            to="/applications"
            className="btn btn-secondary"
          >
            View All
          </Link>
        </div>

        {recentApplications.length === 0 ? (
          <EmptyState
            message="You don't have any applications yet."
          />
        ) : (
          <div className="application-grid">
            {recentApplications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                onDelete={() => {}}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Dashboard;