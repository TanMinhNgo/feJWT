import { Route, Routes } from "react-router-dom";
import UserDashboard from "../components/UserDashboard/UserDashboard";

const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/user-dashboard" element={<UserDashboard />} />
      <Route path="/user-settings" element={<h1>User Settings</h1>} />
    </Routes>
  );
};
