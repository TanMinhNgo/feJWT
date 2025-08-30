import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

interface PrivateRoutesProps {
  children: React.ReactNode;
}

const PrivateRoutes = ({ children }: PrivateRoutesProps) => {
  const user = useSelector((state: any) => state.user);
  
  // Kiểm tra xem user đã đăng nhập chưa
  const authData = sessionStorage.getItem("authData");
  const isAuthenticated = authData && user.isLoggedIn;
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

export default PrivateRoutes;
