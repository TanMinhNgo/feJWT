import axios from "axios";

const registerNewUser = async (data: any) => {
    const response = await axios.post(
        "http://localhost:8080/api/v1/register",
        data
      );

    return response;
};

const loginUser = async (data: any) => {
    const response = await axios.post(
        "http://localhost:8080/api/v1/login",
        data
      );

    return response;
};

export { registerNewUser, loginUser };