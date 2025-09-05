import axios from "../setup/axios";

const getAllRoles = async (currentPage: number, currentLimit: number) => {
  const response = await axios.get(
    `/v1/role/read?page=${currentPage}&limit=${currentLimit}`
  );

  return response;
};

const addRole = async (roleData: any) => {
  const response = await axios.post("/v1/role/create", { data: roleData });

  return response;
};

const editRole = async (roleId: number, roleData: any) => {
  const response = await axios.put(`/v1/role/update/${roleId}`, {
    url: roleData.url,
    description: roleData.description,
  });

  return response;
};

const deleteRole = async (roleId: number) => {
  const response = await axios.delete(`/v1/role/delete/${roleId}`);

  return response;
};

const getRoleByGroup = async (groupId: number) => {
  const response = await axios.get(`/v1/role/by-group/${groupId}`);

  return response;
};

const assignRoleToGroup = async (data: any) => {
  const response = await axios.post("/v1/role/assign-to-group", { data });

  return response;
};

export {
  getAllRoles,
  addRole,
  editRole,
  deleteRole,
  getRoleByGroup,
  assignRoleToGroup,
};
