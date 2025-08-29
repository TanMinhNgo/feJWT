import { toast } from "react-toastify";

const handleErrorFetchApi = {
    handleLoginError: (error: any) => {
        if (
        error.response &&
        (error.response.status === 400 || error.response.status === 500)
      ) {
        const message =
          error.response.data && typeof error.response.data === "string"
            ? error.response.data
            : "Login failed";
        toast.error(message, {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.error("Login failed", {
          position: "top-right",
          autoClose: 3000,
        });
      }
      console.error("Login failed:", error);
    },

    handleRegisterError: (error: any) => {
        if (
          error.response &&
          (error.response.status === 400 || error.response.status === 500)
        ) {
          const message =
            error.response.data && typeof error.response.data === "string"
              ? error.response.data
              : "Registration failed";
          toast.error(message, {
            position: "top-right",
            autoClose: 3000,
          });
        } else {
          toast.error("Registration failed", {
            position: "top-right",
            autoClose: 3000,
          });
        }
        console.error("Registration failed:", error);
    }
}

export default handleErrorFetchApi;