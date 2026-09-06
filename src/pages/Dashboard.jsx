import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getApplications,
  getStatistics,
} from "../api/applications";

import StatCard from "../components/StatCard";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentApplications, setRecentApplications] =
    useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = async () => {
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
      setRecentApplications(
        applicationsData.results.slice(0, 5)
      );
    } catch (error) {
      setError(
        "Failed to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
  return (
    <Loader message="Loading dashboard..." />
  );
}

  if (error) {
  return (
    <ErrorState
      message={error}
      onRetry={fetchDashboardData}
    />
  );
}

  return (
    <div>
      <h1>Dashboard</h1>

      <Link to="/applications/new">
        Add Application
      </Link>

      <div>
        <StatCard
          title="Total"
          value={stats?.total ?? 0}
        />

        <StatCard
          title="Applied"
          value={stats?.applied ?? 0}
        />

        <StatCard
          title="Interviews"
          value={stats?.interview ?? 0}
        />

        <StatCard
          title="Offers"
          value={stats?.offer ?? 0}
        />

        <StatCard
          title="Rejected"
          value={stats?.rejected ?? 0}
        />
      </div>

      <h2>Recent Applications</h2>

      {recentApplications.length === 0 ? (
  <EmptyState message="No applications yet." />
) : (
        <div>
          {recentApplications.map(
            (application) => (
              <div
                key={application.id}
              >
                <h3>
                  {application.position}
                </h3>

                <p>
                  {application.company}
                </p>

                <p>
                  Status:{" "}
                  {application.status}
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
              </div>
            )
          )}
        </div>
      )}

      <p>
        <Link to="/applications">
          View All Applications
        </Link>
      </p>
    </div>
  );
}

export default Dashboard;