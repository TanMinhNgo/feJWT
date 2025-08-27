import { Link } from "react-router-dom";
import "./Register.scss";
import ScrollTop from "../UI/ScrollTop";

function Register() {
  return (
    <div className="register-container">
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
              <h2>Register</h2>
              <form>
                <div className="mb-3">
                  <span className="form-label">Username:</span>
                  <input
                    type="text"
                    id="username"
                    className="form-control"
                    placeholder="Username"
                  />
                </div>
                <div className="mb-3">
                  <span className="form-label">Email address:</span>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    placeholder="Email address"
                  />
                </div>
                <div className="mb-3">
                  <span className="form-label">Gender:</span>
                  <div className="d-flex gap-3">
                    <div className="form-check">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        id="gender-m"
                        className="form-check-input"
                        defaultChecked
                      />
                      <label htmlFor="gender-m" className="form-check-label">
                        Male
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        id="gender-f"
                        className="form-check-input"
                      />
                      <label htmlFor="gender-f" className="form-check-label">
                        Female
                      </label>
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <span className="form-label">Phone number:</span>
                  <input
                    type="tel"
                    id="phone"
                    className="form-control"
                    placeholder="Phone number"
                  />
                </div>
                <div className="mb-3">
                  <span className="form-label">Address:</span>
                  <input
                    type="text"
                    id="address"
                    className="form-control"
                    placeholder="Address"
                  />
                </div>
                <div className="mb-3">
                  <span className="form-label">Password:</span>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    placeholder="Password"
                  />
                </div>
                <div className="mb-3">
                  <span className="form-label">Confirm Password:</span>
                  <input
                    type="password"
                    id="confirmPassword"
                    className="form-control"
                    placeholder="Confirm Password"
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100 mb-3">
                  Register
                </button>
                <hr />
                <div className="text-center d-flex flex-column gap-2">
                  <span>Already have an account?</span>
                  <Link to="/login" className="btn btn-success">
                    Login Here
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

export default Register;
