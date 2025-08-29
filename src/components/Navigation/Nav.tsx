import "./Nav.scss";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

interface NavProps {
  readonly isLoggedIn: boolean;
}

function Nav({ isLoggedIn }: NavProps) {
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
              <li className="nav-item">
                <span className="nav-link fs-5">
                  <FontAwesomeIcon icon={faUser} />
                </span>
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
