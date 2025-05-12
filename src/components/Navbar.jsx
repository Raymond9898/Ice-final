import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaUserCircle, FaSignInAlt, FaSignOutAlt, FaRobot, FaGamepad } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isGamesOpen, setIsGamesOpen] = useState(false); // New state for Mini Games dropdown
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const navbarRef = useRef(null);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/review", label: "Review Form" },
    { path: "/addproducts", label: "Add Products" },
    { path: "/location", label: "Location" },
  ];

  const gameLinks = [
    { path: "/jewelmatch", label: "Ice Jewel Match" },
    { path: "/jewelrescue", label: "Jewel Melt Rescue" },
   
    { path: "/jewelcatch", label: "Jewel Catch" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsMenuOpen(false);
        setIsGamesOpen(false); // Close games dropdown when clicking outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsMenuOpen(false);
      setIsGamesOpen(false); // Close games dropdown on Escape key
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      setIsMenuOpen(false);
      setIsGamesOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleChatbotClick = () => {
    setIsMenuOpen(false);
    navigate("/chatbot");
    window.scrollTo(0, 0);
  };

  return (
    <header ref={navbarRef}>
      <nav
        className="navbar navbar-expand-lg navbar-light bg-white shadow-sm"
        onKeyDown={handleKeyDown}
        role="navigation"
      >
        <div className="container">
          <Link
            to="/"
            className="navbar-brand fw-bold fs-4"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Ice Jewelz Home"
          >
            <span className="text-primary">❄️</span> Ice Jewelz
          </Link>

          <div className="d-flex d-lg-none align-items-center gap-2">
            <button
              className="navbar-toggler border-0"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-label="Toggle navigation"
              aria-controls="navbarContent"
            >
              {isMenuOpen ? (
                <span className="fs-4">✕</span>
              ) : (
                <span className="navbar-toggler-icon"></span>
              )}
            </button>
          </div>

          <div
            className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`}
            style={{ transition: "all 0.3s ease" }}
            id="navbarContent"
          >
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {navLinks.map((link) => (
                <li key={link.path} className="nav-item">
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "active fw-bold" : ""}`
                    }
                    onClick={() => setIsMenuOpen(false)}
                    aria-current={({ isActive }) => (isActive ? "page" : undefined)}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}

              {/* Mini Games Dropdown */}
              <li className="nav-item dropdown">
                <button
                  type="button"
                  className="btn nav-link dropdown-toggle d-flex align-items-center"
                  onClick={() => setIsGamesOpen(!isGamesOpen)}
                  aria-expanded={isGamesOpen}
                  aria-haspopup="true"
                >
                  <FaGamepad className="me-1" /> Mini Games
                </button>

                {isGamesOpen && (
                  <ul className="dropdown-menu show position-static" style={{ zIndex: 1000 }}>
                    {gameLinks.map((game) => (
                      <li key={game.path}>
                        <Link
                          to={game.path}
                          className="dropdown-item"
                          onClick={() => {
                            setIsMenuOpen(false);
                            setIsGamesOpen(false);
                          }}
                        >
                          {game.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            </ul>

            <div className="d-flex align-items-center gap-3">
              <button
                onClick={handleChatbotClick}
                className="btn btn-outline-primary d-flex align-items-center"
                aria-label="Chat support"
              >
                <FaRobot className="me-1" /> Help
              </button>

              <div className="dropdown">
                <button
                  className="btn btn-outline-secondary dropdown-toggle d-flex align-items-center"
                  type="button"
                  id="authDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  aria-haspopup="true"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1" aria-hidden="true"></span>
                      <span aria-live="polite">Loading...</span>
                    </>
                  ) : (
                    <>
                      <FaUserCircle className="me-1" />
                      {isAuthenticated ? user?.name || "Account" : "Account"}
                    </>
                  )}
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="authDropdown">
                  {isAuthenticated ? (
                    <>
                      <li>
                        <Link to="/profile" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>
                          Profile
                        </Link>
                      </li>
                      <li>
                        <Link to="/orders" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>
                          Orders
                        </Link>
                      </li>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <button className="dropdown-item" onClick={handleLogout}>
                          <FaSignOutAlt className="me-2" /> Logout
                        </button>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <Link to="/signin" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>
                          <FaSignInAlt className="me-2" /> Sign In
                        </Link>
                      </li>
                      <li>
                        <Link to="/signup" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>
                          Sign Up
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
