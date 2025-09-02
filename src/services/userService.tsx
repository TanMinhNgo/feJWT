import axios from "../setup/axios";

const getAllUsers = async (currentPage: number, currentLimit: number) => {
  const response = await axios.get(`/v1/user/read?page=${currentPage}&limit=${currentLimit}`);

  return response;
};

const deleteUser = async (userId: number) => {
  const response = await axios.delete(`/v1/user/delete/${userId}`);
  return response;
};

const addUser = async (userData: any) => {
  const response = await axios.post("/v1/user/create", userData);
  return response;
};

const editUser = async (userId: number, userData: any) => {
  const response = await axios.put(`/v1/user/update/${userId}`, userData);
  return response;
};

const getGroupList = async () => {
  const response = await axios.get("/v1/group/read");
  return response;
};

export { getAllUsers, deleteUser, addUser, editUser, getGroupList };
