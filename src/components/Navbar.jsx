import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function Navbar() {
  const { username, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          JobTrail
        </Link>

        <div className="navbar-links">
          <Link to="/">Dashboard</Link>
          <Link to="/applications">Applications</Link>
          <Link to="/applications/new">Add Application</Link>
        </div>

        <div className="navbar-user">
          <span>{username}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;