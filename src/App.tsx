import "./App.scss";
import Nav from "./components/Navigation/Nav";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import { clearUser, setUser } from "./stores/userSlice";
import { useNavigate } from "react-router-dom";

function App() {
  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    const storedAuthData = sessionStorage.getItem("authData");
    if (storedAuthData) {
      try {
        const parsedData = JSON.parse(storedAuthData);
        if (parsedData.isAuthenticated && !user.isLoggedIn) {
          dispatch(setUser(parsedData.user)); // Sử dụng setUser
        }
      } catch (err) {
        console.error("Error parsing auth data:", err);
        sessionStorage.removeItem("authData");
        dispatch(clearUser()); // Sử dụng clearUser
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [dispatch, user.isLoggedIn]);

  return (
    <div>
      <div className="app-header">
        <Nav isLoggedIn={user.isLoggedIn} />
      </div>
      <div className="app-container">
        <AppRoutes />
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
