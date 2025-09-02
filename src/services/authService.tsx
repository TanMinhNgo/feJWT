import axios from "../setup/axios";

const registerNewUser = async (data: any) => {
    const response = await axios.post(
        "/v1/register",
        data
      );

    return response;
};

const loginUser = async (data: any) => {
    const response = await axios.post(
        "/v1/login",
        data
      );

    return response;
};

export { registerNewUser, loginUser };