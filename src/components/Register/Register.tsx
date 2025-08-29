import { Link, useNavigate } from "react-router-dom";
import "./Register.scss";
import ScrollTop from "../UI/ScrollTop";
import { useState, useRef } from "react";
import { toast } from "react-toastify";
import { registerNewUser } from "../../services/userService";
import handleErrorFetchApi from "../UI/HandleErrorFetchApi";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    gender: "male",
    phone: "",
    address: "",
    password: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const navigate = useNavigate();

  // Tạo ref cho các input
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.phone) newErrors.phone = "Phone is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    return newErrors;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const validationErrors = validate();
      setErrors(validationErrors);

      // Focus vào input đầu tiên bị lỗi
      if (Object.keys(validationErrors).length > 0) {
        const firstError = Object.keys(validationErrors)[0];
        switch (firstError) {
          case "username":
            usernameRef.current?.focus();
            break;
          case "email":
            emailRef.current?.focus();
            break;
          case "phone":
            phoneRef.current?.focus();
            break;
          case "address":
            addressRef.current?.focus();
            break;
          case "password":
            passwordRef.current?.focus();
            break;
          case "confirmPassword":
            confirmPasswordRef.current?.focus();
            break;
          default:
            break;
        }
         Object.values(validationErrors).forEach((error: string) => {
          toast.error(error, {
            position: "top-right",
            autoClose: 3000,
          });
        });
        return;
      }
      // Submit form
      const response = await registerNewUser(formData);

      // Check response status
      if (response.status === 201) {
        toast.success("Registration successful!", {
          position: "top-right",
          autoClose: 3000,
        });

        navigate("/login");
      }
    } catch (error: any) {
      handleErrorFetchApi.handleRegisterError(error);
    }
  };

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
              <form className="register-form" onSubmit={handleRegister}>
                <div className="mb-3">
                  <span className="form-label">Username:</span>
                  <input
                    ref={usernameRef}
                    type="text"
                    id="username"
                    className="form-control"
                    placeholder="Username"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                  />
                  {errors.username && (
                    <div className="text-danger">{errors.username}</div>
                  )}
                </div>
                <div className="mb-3">
                  <span className="form-label">Email address:</span>
                  <input
                    ref={emailRef}
                    type="email"
                    id="email"
                    className="form-control"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                  {errors.email && (
                    <div className="text-danger">{errors.email}</div>
                  )}
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
                        onChange={(e) =>
                          setFormData({ ...formData, gender: e.target.value })
                        }
                        checked={formData.gender === "male"}
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
                        onChange={(e) =>
                          setFormData({ ...formData, gender: e.target.value })
                        }
                        checked={formData.gender === "female"}
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
                    ref={phoneRef}
                    type="tel"
                    id="phone"
                    className="form-control"
                    placeholder="Phone number"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                  {errors.phone && (
                    <div className="text-danger">{errors.phone}</div>
                  )}
                </div>
                <div className="mb-3">
                  <span className="form-label">Address:</span>
                  <input
                    ref={addressRef}
                    type="text"
                    id="address"
                    className="form-control"
                    placeholder="Address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  />
                  {errors.address && (
                    <div className="text-danger">{errors.address}</div>
                  )}
                </div>
                <div className="mb-3">
                  <span className="form-label">Password:</span>
                  <input
                    ref={passwordRef}
                    type="password"
                    id="password"
                    className="form-control"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                  {errors.password && (
                    <div className="text-danger">{errors.password}</div>
                  )}
                </div>
                <div className="mb-3">
                  <span className="form-label">Confirm Password:</span>
                  <input
                    ref={confirmPasswordRef}
                    type="password"
                    id="confirmPassword"
                    className="form-control"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {errors.confirmPassword && (
                    <div className="text-danger">{errors.confirmPassword}</div>
                  )}
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
