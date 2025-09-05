import { faCirclePlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, useRef } from "react";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { addRole, deleteRole, editRole, getAllRoles } from "../../services/roleService";
import handleErrorFetchApi from "../UI/HandleErrorFetchApi";
import ReactPaginate from "react-paginate";
import RoleModal from "./RoleModal";

type Child = { url: string; description: string };
type ListChilds = { [key: string]: Child };
type dataToPersist = { url: string; description: string }[];
type Role = {
  id: number;
  url: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

function RoleDashboard() {
  const [listRoles, setListRoles] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [listChilds, setListChilds] = useState<ListChilds>({
    child1: { url: "", description: "" },
  });
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>(
    {}
  );
  const [showModal, setShowModal] = useState(false);
  const [typeModal, setTypeModal] = useState<"edit" | "delete">("edit");
  const [selectedRole, setSelectedRole] = useState<Role>();
  const [formData, setFormData] = useState({
    url: "",
    description: ""
  });

  const urlInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedAuthData = sessionStorage.getItem("authData");
    if (!storedAuthData) {
      navigate("/login");
    } else {
      fetchAllRoles();
    }
  }, [currentPage]);

  useEffect(() => {
    // Clear errors when modal closes
    if (!showModal) {
      setValidationErrors({});
    }
  }, [showModal]);

  const buildDatatoPersist = () => {
    let _listChilds = _.cloneDeep(listChilds);
    let dataToPersist: dataToPersist = [];
    Object.entries(_listChilds).forEach(([, child]) => {
      if (child.url.trim()) {
        dataToPersist.push({
          url: child.url.trim(),
          description: child.description.trim(),
        });
      }
    });
    return dataToPersist;
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

  const handleOnchangeChild = (
    name: "url" | "description",
    value: string,
    key: string
  ) => {
    let _listChilds = _.cloneDeep(listChilds);
    _listChilds[key][name] = value;

    if (validationErrors[key]) {
      setValidationErrors((prev) => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
    }

    setListChilds(_listChilds);
  };

  const handleAddNewInput = () => {
    let _listChilds = _.cloneDeep(listChilds);
    _listChilds[`child${uuidv4()}`] = { url: "", description: "" };
    setListChilds(_listChilds);
  };

  const handleDeleteInput = (key: string) => {
    if (Object.keys(listChilds).length <= 1) {
      toast.warning("At least one role input is required", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    let _listChilds = _.cloneDeep(listChilds);
    delete _listChilds[key];

    if (validationErrors[key]) {
      setValidationErrors((prev) => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
    }

    setListChilds(_listChilds);
  };

  const validateInputs = () => {
    const errors: { [key: string]: string } = {};
    let isValid = true;

    Object.entries(listChilds).forEach(([key, child]) => {
      if (!child.url.trim() && !child.description.trim()) {
        return;
      }

      if (!child.url.trim()) {
        errors[key] = "URL is required";
        isValid = false;
      } else {
        const urlPattern = /^\/[A-Za-z0-9\-_/:]*$/;
        if (!urlPattern.test(child.url.trim())) {
          errors[key] =
            "URL must start with '/' and contain only letters, numbers, hyphens, underscores, or colons";
          isValid = false;
        }
      }
    });

    setValidationErrors(errors);
    return { isValid, errors };
  };

  const handleSaveChanges = async () => {
    try {
      const validation = validateInputs();

      if (!validation.isValid) {
        const firstError = Object.values(validation.errors)[0];
        toast.error(firstError, {
          position: "top-right",
          autoClose: 3000,
        });
        urlInputRef.current?.focus();
        return;
      }

      const data = buildDatatoPersist();

      if (data.length === 0) {
        toast.warning("Please add at least one role with a valid URL", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      const response = await addRole(data);

      if (response.status === 201) {
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 3000,
        });
        setListChilds({ child1: { url: "", description: "" } });
        setValidationErrors({});
        fetchAllRoles();
      }
    } catch (error) {
      handleErrorFetchApi.handleAddRoleError(error);
    }
  };

  const handleDeleteRole = async (roleId: number) => {
    try {
      const response = await deleteRole(roleId);

      if (response.status === 200) {
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 3000,
        });
        fetchAllRoles();
      }
    } catch (error) {
      handleErrorFetchApi.handleDeleteRoleError(error);
    }
  };

  const handleOpenModal = (type: "edit" | "delete", role?: any) => {
    setTypeModal(type);
    setSelectedRole(role || null);
    setShowModal(true);
  
    if (type === "edit" && role) {
      setFormData({
        url: role.url,
        description: role.description,
      });
    } else {
      setFormData({
        url: "",
        description: "",
      });
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmitEdit = async () => {
    if (!selectedRole) return;

    try {
      const response = await editRole(selectedRole.id, formData);

      if (response.status === 200) {
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 3000,
        });
        fetchAllRoles();
        setShowModal(false);
      }
    } catch (error) {
      handleErrorFetchApi.handleDeleteRoleError(error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedRole) return;
    await handleDeleteRole(selectedRole.id);
    setShowModal(false);
  };

  return (
    <div className="role-container">
      <div className="container">
        <div className="mt-3">
          <div className="title-role">
            <h4>Add a new role...</h4>
          </div>
          <div className="role-parent">
            {Object.entries(listChilds).map(([key, child], index) => {
              const hasError = validationErrors[key];

              return (
                <div
                  className={`row role-child mb-3 ${key}`}
                  key={`child-${key}`}
                >
                  <div className="col-5 form-group">
                    <label htmlFor={`url-${key}`}>
                      URL: <span className="text-danger">*</span>
                    </label>
                    <input
                      id={`url-${key}`}
                      ref={index === 0 ? urlInputRef : null}
                      className={`form-control ${hasError ? "is-invalid" : ""}`}
                      type="text"
                      value={child.url}
                      onChange={(e) =>
                        handleOnchangeChild("url", e.target.value, key)
                      }
                      placeholder="/api/endpoint"
                    />
                    {hasError && (
                      <div className="invalid-feedback">
                        {validationErrors[key]}
                      </div>
                    )}
                  </div>
                  <div className="col-5 form-group">
                    <label htmlFor={`desc-${key}`}>Description:</label>
                    <input
                      id={`desc-${key}`}
                      className="form-control"
                      type="text"
                      value={child.description}
                      onChange={(e) =>
                        handleOnchangeChild("description", e.target.value, key)
                      }
                      placeholder="Role description"
                    />
                  </div>
                  <div className="col-2 form-group d-flex align-items-end gap-1">
                    <button
                      className="btn btn-success"
                      onClick={handleAddNewInput}
                      title="Add new role"
                    >
                      <FontAwesomeIcon icon={faCirclePlus} />
                    </button>
                    <button
                      className="btn btn-danger ms-2"
                      onClick={() => handleDeleteInput(key)}
                      disabled={Object.keys(listChilds).length <= 1}
                      title={
                        Object.keys(listChilds).length <= 1
                          ? "Cannot delete the last role"
                          : "Delete role"
                      }
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              );
            })}

            <div className="mt-4">
              <button
                className="btn btn-warning"
                onClick={handleSaveChanges}
              >
                Save Changes
              </button>
            </div>
          </div>

          <div className="role-list mt-5">
            <h4>List of roles:</h4>
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-light">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">ID</th>
                    <th scope="col">URL</th>
                    <th scope="col">Description</th>
                    <th scope="col" className="text-center">
                      Actions
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
                    listRoles.map((role: any, index: number) => (
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
                          <button
                            className="btn btn-warning btn-sm"
                            title="Edit role"
                            onClick={() => handleOpenModal("edit", role)}
                          >
                            <FontAwesomeIcon icon={faEdit} className="me-1" />
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm ms-2"
                            title="Delete role"
                            onClick={() => handleOpenModal("delete", role)}
                          >
                            <FontAwesomeIcon icon={faTrash} className="me-1" />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
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
      </div>

      <RoleModal
        showModal={showModal}
        typeModal={typeModal}
        selectedRole={selectedRole}
        formData={formData}
        refs={{ urlRef: urlInputRef }}
        errors={validationErrors}
        onClose={() => setShowModal(false)}
        onSubmitEdit={handleSubmitEdit}
        onConfirmDelete={handleConfirmDelete}
        onFieldChange={handleFieldChange}
        isSubmitting={false}
        isDeleting={false}
      />
    </div>
  );
}

export default RoleDashboard;