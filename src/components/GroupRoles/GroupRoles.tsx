import { useEffect, useState } from "react";
import handleErrorFetchApi from "../UI/HandleErrorFetchApi";
import { getGroupList } from "../../services/userService";
import ReactPaginate from "react-paginate";
import {
  assignRoleToGroup,
  getAllRoles,
  getRoleByGroup,
} from "../../services/roleService";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

type UserGroup = {
  id: number;
  name: string;
  description: string;
};

type Role = {
  id: number;
  url: string;
  description: string;
};

function GroupRoles() {
  const [userGroups, setUserGroups] = useState<UserGroup[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<number>(0);
  const [listRoles, setListRoles] = useState<Role[]>([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const storedAuthData = sessionStorage.getItem("authData");
    if (!storedAuthData) {
      navigate("/login");
    } else {
      fetchGroupList();
      fetchAllRoles();
    }
  }, [currentPage]);

  useEffect(() => {
    if (selectedGroupId > 0) {
      fetchRolesByGroup(selectedGroupId);
    } else {
      setSelectedRoleIds([]);
    }
  }, [selectedGroupId]);

  const fetchGroupList = async () => {
    try {
      const response = await getGroupList();
      if (response.status === 200) {
        setUserGroups(response.data.data);
      }
    } catch (error) {
      handleErrorFetchApi.handleGetGroupListError(error);
    }
  };

  const fetchAllRoles = async () => {
    try {
      const response = await getAllRoles(currentPage, currentLimit);
      if (response.status === 200) {
        setListRoles(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      handleErrorFetchApi.handleGetAllRolesError(error);
    }
  };

  const handlePageClick = async (data: { selected: number }) => {
    const selectedPage = data.selected + 1;
    setCurrentPage(selectedPage);
    setCurrentLimit(5);
  };

  const fetchRolesByGroup = async (groupId: number) => {
    try {
      const response = await getRoleByGroup(groupId);
      if (response.status === 200) {
        const groupRoles = response.data.data.Roles || [];
        setSelectedRoleIds(groupRoles.map((role: Role) => role.id));
      }
    } catch (error) {
      handleErrorFetchApi.handleGetAllRolesError(error);
    }
  };

  const handleRoleCheckboxChange = (roleId: number) => {
    setSelectedRoleIds((prev) => {
      if (prev.includes(roleId)) {
        return prev.filter((id) => id !== roleId);
      } else {
        return [...prev, roleId];
      }
    });
  };

  const isRoleSelected = (roleId: number) => {
    return selectedRoleIds.includes(roleId);
  };

  const handleSave = async () => {
    try {
      if (selectedGroupId === 0) {
        toast.error("Please select a group first", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      let groupRoles: any = [];
      selectedRoleIds.forEach((roleId) => {
        groupRoles.push({ groupId: selectedGroupId, roleId: roleId });
      });

      const data = {
        groupId: selectedGroupId,
        groupRoles: groupRoles,
      };

      console.log("Data to be sent:", data);

      const response = await assignRoleToGroup(data);

      if (response.status === 200) {
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      handleErrorFetchApi.handleAssignRoleToGroupError(error);
    }
  };

  return (
    <div className="group-role-container">
      <div className="container">
        <div className="row mt-3">
          <h4 className="text-center">Group Roles Management</h4>
          <div>
            <span>Select Group:</span>
            <div className="col-12 col-sm-6 form-group mt-2">
              <span className="form-label">
                Group: <span className="text-danger">*</span>
              </span>
              <select
                className="form-select"
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(Number(e.target.value))}
              >
                <option value={0}>Select a group</option>
                {userGroups?.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name} - {group.description}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="role-list mt-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>Available Roles:</h4>
            <button className="btn btn-warning" onClick={() => handleSave()}>
              <FontAwesomeIcon icon={faSave} /> Save
            </button>
          </div>
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-light">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">ID</th>
                  <th scope="col">URL</th>
                  <th scope="col">Description</th>
                  <th scope="col" className="text-center">
                    {selectedGroupId > 0
                      ? "Assign to Group"
                      : "Select Group First"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {listRoles.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      <div className="text-muted">
                        <i className="fas fa-list fa-2x mb-2"></i>
                        <p>No roles found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  listRoles.map((role: Role, index: number) => (
                    <tr key={role.id}>
                      <td>{(currentPage - 1) * currentLimit + index + 1}</td>
                      <td>{role.id}</td>
                      <td>
                        <code className="text-primary">{role.url}</code>
                      </td>
                      <td>
                        {role.description || (
                          <em className="text-muted">No description</em>
                        )}
                      </td>
                      <td className="text-center">
                        <div className="form-check d-flex justify-content-center">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value={role.id}
                            checked={isRoleSelected(role.id)}
                            onChange={() => handleRoleCheckboxChange(role.id)}
                            disabled={selectedGroupId === 0}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {totalPages > 0 && (
        <div className="user-footer d-flex justify-content-center py-4">
          <ReactPaginate
            previousLabel={
              <span>
                <i className="fas fa-chevron-left me-1"></i>
                <span className="d-none d-sm-inline">Previous</span>
              </span>
            }
            nextLabel={
              <span>
                <span className="d-none d-sm-inline">Next</span>
                <i className="fas fa-chevron-right ms-1"></i>
              </span>
            }
            breakLabel={"..."}
            pageCount={totalPages}
            marginPagesDisplayed={1}
            pageRangeDisplayed={2}
            onPageChange={handlePageClick}
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            nextClassName="page-item"
            breakClassName="page-item"
            previousLinkClassName="page-link"
            nextLinkClassName="page-link"
            breakLinkClassName="page-link"
            containerClassName="pagination pagination-sm"
            activeClassName="active"
            renderOnZeroPageCount={null}
            forcePage={currentPage - 1}
          />
        </div>
      )}
    </div>
  );
}

export default GroupRoles;
