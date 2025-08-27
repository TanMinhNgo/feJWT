import { Link } from "react-router-dom";
import "./Login.scss";
import ScrollTop from "../UI/ScrollTop";

function Login() {
  return (
    <div className="login-container">
      <ScrollTop />
      <div className="container mt-5">
        <div className="row px-3 px-sm-0">
          <div className="content-left col-12 col-sm-6 d-none d-sm-block">
            <div className="brand">
              <h2>Brand Name</h2>
            </div>
            <div className="detail">
              <p>Description of the brand goes here.</p>
            </div>
          </div>

          <div className="brand d-sm-none text-center mb-4">
            <h2>Brand Name</h2>
          </div>

          <div className="content-right col-12 col-sm-5">
            <div className="d-flex flex-column gap-3 py-3">
              <h2>Login</h2>
              <form>
                <div className="mb-3">
                  <input
                    type="text"
                    id="emailOrPhone"
                    className="form-control"
                    placeholder="Email address or phone number"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    placeholder="Password"
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100 mb-3">
                  Login
                </button>
                <div className="text-center mb-3">
                  <a href="/forgot-password" className="text-decoration-none">
                    Forgot Password?
                  </a>
                </div>
                <hr />
                <div className="text-center">
                  <Link to="/register" className="btn btn-success">
                    Create New Account
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
