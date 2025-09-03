import "./Nav.scss";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSignOutAlt, faUserCircle, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../../stores/userSlice";
import { toast } from "react-toastify";

interface NavProps {
  readonly isLoggedIn: boolean;
}

function Nav({ isLoggedIn }: NavProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.user);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("authData");

    dispatch(clearUser());
    
    setShowDropdown(false);
    
    toast.success("Logged out successfully!", {
      position: 'top-right',
      autoClose: 3000
    });
    
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4 p-3">
      <div className="container-fluid">
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink
                className="nav-link fs-5"
                to={isLoggedIn ? "/user-dashboard" : "/"}
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link fs-5" to="/news">
                News
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link fs-5" to="/contact">
                Contact
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link fs-5" to="/about">
                About
              </NavLink>
            </li>
          </ul>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {isLoggedIn ? (
              <li className="nav-item dropdown position-relative">
                <button 
                  className="nav-link fs-5 btn btn-link text-decoration-none d-flex align-items-center user-dropdown-btn"
                  onClick={() => setShowDropdown(!showDropdown)}
                  style={{ color: 'rgba(255,255,255,.75)' }}
                >
                  <FontAwesomeIcon icon={faUserCircle} className="me-2" />
                  <FontAwesomeIcon 
                    icon={faChevronDown} 
                    className={`dropdown-arrow ${showDropdown ? 'rotated' : ''}`} 
                  />
                </button>
                
                {/* Dropdown Menu */}
                {showDropdown && (
                  <div 
                    className="dropdown-menu dropdown-menu-end show position-absolute bg-white border rounded shadow-lg"
                    ref={dropdownRef}
                    style={{ 
                      top: '100%', 
                      right: 0, 
                      marginTop: '0.5rem',
                      minWidth: '250px',
                      zIndex: 1000
                    }}
                  >
                    {/* Header */}
                    <div className="px-3 py-2 bg-light border-bottom">
                      <div className="d-flex align-items-center">
                        <FontAwesomeIcon icon={faUserCircle} className="me-2 fs-5 text-primary" />
                        <div>
                          <div className="fw-bold text-dark mb-0">{user.user?.username || 'User'}</div>
                          <small className="text-muted">{user.user?.email}</small>
                        </div>
                      </div>
                    </div>
                    
                    {/* Profile Item */}
                    <button 
                      className="dropdown-item d-flex align-items-center py-2 px-3"
                      onClick={() => {
                        setShowDropdown(false);
                        navigate("/profile");
                      }}
                    >
                      <FontAwesomeIcon icon={faUser} className="me-3 text-secondary" />
                      <span>Profile Settings</span>
                    </button>
                    
                    {/* Divider */}
                    <div className="dropdown-divider"></div>
                    
                    {/* Logout Item */}
                    <button 
                      className="dropdown-item d-flex align-items-center py-2 px-3 text-danger"
                      onClick={handleLogout}
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} className="me-3" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) =>
                      `nav-link fs-5 px-3 ${isActive ? "nav-active" : ""}`
                    }
                    to="/login"
                  >
                    Login
                  </NavLink>
                </li>
                <li className="nav-item d-flex align-items-center">
                  <span className="text-light mx-2">|</span>
                </li>
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) =>
                      `nav-link fs-5 px-3 ${isActive ? "nav-active" : ""}`
                    }
                    to="/register"
                  >
                    Register
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
