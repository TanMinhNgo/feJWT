import { Link, useNavigate } from "react-router-dom";
import "./Login.scss";
import ScrollTop from "../UI/ScrollTop";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { loginUser } from "../../services/authService";
import handleErrorFetchApi from "../UI/HandleErrorFetchApi";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../stores/userSlice";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useSelector((state: any) => state.user);

  useEffect(() => {
    const authData = sessionStorage.getItem("authData");
    if (authData) {
      try {
        const parsedData = JSON.parse(authData);
        if (parsedData.isAuthenticated) {
          navigate("/user-dashboard");
        }
      } catch (err) {
        console.error("Error parsing auth data:", err);
        sessionStorage.removeItem("authData");
      }
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const emailOrPhoneRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.emailOrPhone) {
      newErrors.emailOrPhone = "Email or phone number is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    return newErrors;
  };

  const checkEmailOrPhone = (inputValue: string) => {
    if (/\S+@\S+\.\S+/.test(inputValue)) {
      return {
        email: inputValue,
        password: formData.password,
      };
    } else if (/^\d+$/.test(inputValue)) {
      return {
        phone: inputValue,
        password: formData.password,
      };
    }
    return null;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const validationErrors = validate();
      setErrors(validationErrors);

      // Focus vào input đầu tiên bị lỗi
      if (Object.keys(validationErrors).length > 0) {
        const firstError = Object.keys(validationErrors)[0];
        switch (firstError) {
          case "emailOrPhone":
            emailOrPhoneRef.current?.focus();
            break;
          case "password":
            passwordRef.current?.focus();
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

      // Perform login logic here
      const userData = checkEmailOrPhone(formData.emailOrPhone);
      if (!userData) {
        toast.error("Invalid email or phone number", {
          position: "top-right",
          autoClose: 3000,
        });
        emailOrPhoneRef.current?.focus();
        return;
      }

      const response = await loginUser(userData);
      if (response.status === 200) {
        toast.success("Login successful", {
          position: "top-right",
          autoClose: 3000,
        });

        const data = {
          isAuthenticated: true,
          token: "fake token",
          user: response.data.data.user,
        };

        sessionStorage.setItem("authData", JSON.stringify(data));
        dispatch(setUser(response.data.data.user));
        navigate("/user-dashboard");
      }
    } catch (error: any) {
      handleErrorFetchApi.handleLoginError(error);
    }
  };

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
              <form className="login-form" onSubmit={handleLogin}>
                <div className="mb-3">
                  <input
                    ref={emailOrPhoneRef}
                    type="text"
                    id="emailOrPhone"
                    value={formData.emailOrPhone}
                    className="form-control"
                    placeholder="Email address or phone number"
                    onChange={(e) =>
                      setFormData({ ...formData, emailOrPhone: e.target.value })
                    }
                  />
                  {errors.emailOrPhone && (
                    <div className="text-danger">{errors.emailOrPhone}</div>
                  )}
                </div>
                <div className="mb-3">
                  <input
                    ref={passwordRef}
                    type="password"
                    id="password"
                    value={formData.password}
                    className="form-control"
                    placeholder="Password"
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                  {errors.password && (
                    <div className="text-danger">{errors.password}</div>
                  )}
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
