import { Route, Routes } from "react-router-dom";
import UserDashboard from "../components/UserDashboard/UserDashboard";
import Register from "../components/Register/Register";
import Login from "../components/Login/Login";
import About from "../About";
import Contact from "../Contact";
import News from "../News";
import Home from "../Home";
import RoleDashboard from "../components/RoleDashboard/RoleDashboard";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/news" element={<News />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="*"
        element={
          <h2 style={{ textAlign: "center", color: "red", fontSize: "50px" }}>
            404 Not Found
          </h2>
        }
      />

      <Route path="/user-dashboard" element={<UserDashboard />} />
      <Route path="/project" element={<h1>Project Page</h1>} />
      <Route path="/roles" element={<RoleDashboard />} />
    </Routes>
  );
};

export default AppRoutes;
