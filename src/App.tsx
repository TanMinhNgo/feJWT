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
        
        if (parsedData.accessToken && parsedData.user) {
          const userData = {
            user: parsedData.user,
            accessToken: parsedData.accessToken,
            isLoggedIn: true
          };
          
          dispatch(setUser(userData));
        } else {
          sessionStorage.removeItem("authData");
          dispatch(clearUser());
          navigate("/login");
        }
      } catch (err) {
        console.error("❌ Error parsing auth data:", err);
        sessionStorage.removeItem("authData");
        dispatch(clearUser());
        navigate("/login");
      }
    } else {
      dispatch(clearUser());
      navigate("/login");
    }
  }, [dispatch, navigate]);

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
