import axios from "axios";

const getAllUsers = async (currentPage: number, currentLimit: number) => {
  const response = await axios.get("http://localhost:8080/api/v1/user/read", {
    params: {
      page: currentPage,
      limit: currentLimit
    }
  });

  return response;
};

export { getAllUsers };
