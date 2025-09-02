import { toast } from "react-toastify";

const handleErrorFetchApi = {
    handleLoginError: (error: any) => {
        if (
        error.response &&
        (error.response.status === 400 || error.response.status === 500)
      ) {
        let message = "Login failed";
        
        if (error.response.data?.message) {
          message = error.response.data.message;
        } else if (typeof error.response.data === "string") {
          message = error.response.data;
        }
        
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
          let message = "Registration failed";
          
          if (error.response.data?.message) {
            message = error.response.data.message;
          } else if (typeof error.response.data === "string") {
            message = error.response.data;
          }
          
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
    },

    handleGetAllUsersError: (error: any) => {
      if (
        error.response &&
        (error.response.status === 404 || error.response.status === 500)
      ) {
        let message = "Failed to fetch user list";
        
        if (error.response.data?.message) {
          message = error.response.data.message;
        } else if (typeof error.response.data === "string") {
          message = error.response.data;
        }
        
        toast.error(message, {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.error("Failed to fetch user list", {
          position: "top-right",
          autoClose: 3000,
        });
      }
      console.error("Failed to fetch user list:", error);
    },

    handleDeleteUserError: (error: any) => {
      if (
        error.response &&
        (error.response.status === 400 || error.response.status === 500)
      ) {
        let message = "Failed to delete user";
        
        if (error.response.data?.message) {
          message = error.response.data.message;
        } else if (typeof error.response.data === "string") {
          message = error.response.data;
        }
        
        toast.error(message, {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.error("Failed to delete user", {
          position: "top-right",
          autoClose: 3000,
        });
      }
      console.error("Failed to delete user:", error);
    },

    handleAddUserError: (error: any) => {
      if (
        error.response &&
        (error.response.status === 400 || error.response.status === 500)
      ) {
        let message = "Failed to add user";
        
        if (error.response.data?.message) {
          message = error.response.data.message;
        } else if (typeof error.response.data === "string") {
          message = error.response.data;
        }
        
        toast.error(message, {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.error("Failed to add user", {
          position: "top-right",
          autoClose: 3000,
        });
      }
      console.error("Failed to add user:", error);
    },

    handleEditUserError: (error: any) => {
      if (
        error.response &&
        (error.response.status === 400 || error.response.status === 500)
      ) {
        let message = "Failed to edit user";
        
        if (error.response.data?.message) {
          message = error.response.data.message;
        } else if (typeof error.response.data === "string") {
          message = error.response.data;
        }
        
        toast.error(message, {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.error("Failed to edit user", {
          position: "top-right",
          autoClose: 3000,
        });
      }
      console.error("Failed to edit user:", error);
    },

    handleGetGroupListError: (error: any) => {
      if (
        error.response &&
        (error.response.status === 404 || error.response.status === 500)
      ) {
        let message = "Failed to fetch group list";

        if (error.response.data?.message) {
          message = error.response.data.message;
        } else if (typeof error.response.data === "string") {
          message = error.response.data;
        }

        toast.error(message, {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.error("Failed to fetch group list", {
          position: "top-right",
          autoClose: 3000,
        });
      }
      console.error("Failed to fetch group list:", error);
    },
}

export default handleErrorFetchApi;