import "./App.scss";
import Login from "./components/Login/Login";
import Nav from "./components/Navigation/Nav";
import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import News from "./News";
import Contact from "./Contact";
import About from "./About";
import Register from "./components/Register/Register";
import { ToastContainer } from "react-toastify";
import UserDashboard from "./components/UserDashboard/UserDashboard";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

interface AuthData {
  readonly isAuthenticated: boolean;
  readonly token: string;
}

function App() {
  const user = useSelector((state: any) => state.user);

  const dispatch = useDispatch();

  const [authData, setAuthData] = useState<AuthData | null>(null);

  useEffect(() => {
    const storedAuthData = sessionStorage.getItem("authData");
    if (storedAuthData) {
      setAuthData(JSON.parse(storedAuthData));
    } else {
      setAuthData(null);
      dispatch({ type: "user/clearUser" });
    }
  }, [authData]);

  return (
    <div>
      <Nav isLoggedIn={user.isLoggedIn} />

      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/news" element={<News />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route
          path="*"
          element={
            <h2 style={{ textAlign: "center", color: "red", fontSize: "50px" }}>
              404 Not Found
            </h2>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
