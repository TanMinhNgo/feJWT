import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


function UserDashboard() {
    const navigate = useNavigate();

    useEffect(() => {
        const storedAuthData = sessionStorage.getItem("authData");
        if(!storedAuthData) {
            navigate("/login");
        }
    }, []);

    return (
        <div>
            <h2>User Dashboard</h2>
            {/* Add user-specific content here */}
        </div>
    );
}

export default UserDashboard;