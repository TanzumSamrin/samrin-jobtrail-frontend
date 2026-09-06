import { useAuth } from "../auth/AuthContext";

function Dashboard() {
  const {
    username,
    isAuthenticated,
    loading,
  } = useAuth();

  if (loading) {
    return <p>Loading authentication...</p>;
  }

  return (
    <div>
      <h1>Dashboard</h1>

      <p>
        Authenticated: {isAuthenticated ? "Yes" : "No"}
      </p>

      <p>
        Username: {username || "Not logged in"}
      </p>
    </div>
  );
}

export default Dashboard;