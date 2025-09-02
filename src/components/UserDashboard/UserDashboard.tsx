import "./UserDashboard.scss";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import handleErrorFetchApi from "../UI/HandleErrorFetchApi";
import { addUser, deleteUser, editUser, getAllUsers } from "../../services/userService";
import { toast } from "react-toastify";
import UserModal from "./UserModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate, faCirclePlus, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";


type User = {
  id: number;
  email: string;
  username: string;
  phone: string;
  address: string;
  gender: string;
  group: {
    id: number;
    name: string;
    description: string;
  };
  createdAt: string;
  updatedAt: string;
  totalPages: number;
  totalRows: number;
};

function UserDashboard() {
  const [userList, setUserList] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [typeModal, setTypeModal] = useState<"add" | "edit" | "delete">("add");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    phone: "",
    address: "",
    gender: "male",
    password: "",
    confirmPassword: "",
    groupId: 0,
  });

  // Refs for form validation
  const emailRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const groupRef = useRef<HTMLSelectElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedAuthData = sessionStorage.getItem("authData");
    if (!storedAuthData) {
      navigate("/login");
    } else {
      fetchApi();
    }
  }, [currentPage]);

  useEffect(() => {
    // Clear errors when modal closes
    if (!showModal) {
      setErrors({});
    }
  }, [showModal]);

  const fetchApi = async () => {
    try {
      const response = await getAllUsers(currentPage, currentLimit);

      console.log(response.data);
      if (response.status === 200) {
        setUserList(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      handleErrorFetchApi.handleGetAllUsersError(error);
    }
  };

  const handlePageClick = async (data: { selected: number }) => {
    const selectedPage = data.selected + 1;
    setCurrentPage(selectedPage);
    setCurrentLimit(5);
  };

  const handleDelete = async (userId: number) => {
    try {
      const response = await deleteUser(userId);
      if (response.status === 200) {
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 3000,
        });
        setShowModal(false);
        fetchApi();
      }
    } catch (error) {
      handleErrorFetchApi.handleDeleteUserError(error);
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^\d{10,11}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = "Phone must be 10-11 digits";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (formData.groupId === 0) {
      newErrors.groupId = "Please select a group";
    }

    // Password validation only for Add mode
    if (typeModal === "add") {
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Confirm password is required";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    return newErrors;
  };

  const focusFirstError = (firstErrorField: string) => {
    switch (firstErrorField) {
      case "username":
        usernameRef.current?.focus();
        break;
      case "email":
        emailRef.current?.focus();
        break;
      case "phone":
        phoneRef.current?.focus();
        break;
      case "address":
        addressRef.current?.focus();
        break;
      case "password":
        passwordRef.current?.focus();
        break;
      case "confirmPassword":
        confirmPasswordRef.current?.focus();
        break;
      case "groupId":
        groupRef.current?.focus();
        break;
      default:
        break;
    }
  };

  const handleFieldChange = (field: string, value: string | number) => {
    setFormData({ ...formData, [field]: value });
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const openModal = (type: "add" | "edit" | "delete", user?: User) => {
    setTypeModal(type);
    setSelectedUser(user || null);

    if (type === "edit" && user) {
      setFormData({
        email: user.email,
        username: user.username,
        phone: user.phone,
        address: user.address,
        gender: user.gender,
        password: "",
        confirmPassword: "",
        groupId: user.group.id,
      });
    } else if (type === "add") {
      setFormData({
        email: "",
        username: "",
        phone: "",
        address: "",
        gender: "male",
        password: "",
        confirmPassword: "",
        groupId: 0,
      });
    }

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setErrors({});
    setFormData({
      email: "",
      username: "",
      phone: "",
      address: "",
      gender: "male",
      password: "",
      confirmPassword: "",
      groupId: 0,
    });
  };

  const handleSubmitAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      const firstError = Object.keys(validationErrors)[0];
      focusFirstError(firstError);

      // Show error toast for first error only
      const firstErrorMessage = Object.values(validationErrors)[0];
      toast.error(firstErrorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const response = await addUser(formData);
      if (response.status === 201) {
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 3000,
        });
        closeModal();
        fetchApi();
      }
    } catch (error) {
      handleErrorFetchApi.handleAddUserError(error);
    }
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      const firstError = Object.keys(validationErrors)[0];
      focusFirstError(firstError);

      // Show error toast for first error only
      const firstErrorMessage = Object.values(validationErrors)[0];
      toast.error(firstErrorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      if (!selectedUser) return;
      const response = await editUser(selectedUser.id, formData);
      if (response.status === 200) {
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 3000,
        });
        closeModal();
        fetchApi();
      }
    } catch (error) {
      handleErrorFetchApi.handleEditUserError(error);
    }
  };

  const confirmDelete = () => {
    if (selectedUser) {
      handleDelete(selectedUser.id);
    }
  };

  return (
    <div className="manage-users-container container-fluid px-3 px-md-4">
      {/* Header Section */}
      <div className="user-header text-center py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">
            <h3 className="mb-3 mb-md-4">User Dashboard</h3>
            <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
              <button 
                className="btn btn-success"
                onClick={fetchApi}
              >
                <FontAwesomeIcon icon={faArrowsRotate} /> Refresh
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => openModal("add")}
              >
                <FontAwesomeIcon icon={faCirclePlus} /> Add New User
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="user-list">
        <div className="row">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-bottom">
                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center">
                  <h5 className="mb-2 mb-sm-0">User List</h5>
                  <small className="text-muted">
                    Page {currentPage} of {totalPages}
                  </small>
                </div>
              </div>
              
              <div className="card-body p-0">
                {/* Desktop Table */}
                <div className="table-responsive d-none d-md-block">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th scope="col" className="text-center">#</th>
                        <th scope="col">ID</th>
                        <th scope="col">Email</th>
                        <th scope="col">Username</th>
                        <th scope="col">Phone</th>
                        <th scope="col">Address</th>
                        <th scope="col">Group</th>
                        <th scope="col" className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="table-group-divider">
                      {userList.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="text-center py-4">
                            <div className="text-muted">
                              <i className="fas fa-users fa-2x mb-2"></i>
                              <p>No users found</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        userList.map((user, index) => (
                          <tr key={user.id}>
                            <td className="text-center">
                              {(currentPage - 1) * currentLimit + index + 1}
                            </td>
                            <td>{user.id}</td>
                            <td>
                              <div className="text-truncate" style={{ maxWidth: "150px" }}>
                                {user.email}
                              </div>
                            </td>
                            <td>{user.username}</td>
                            <td>{user.phone}</td>
                            <td>
                              <div className="text-truncate" style={{ maxWidth: "120px" }}>
                                {user.address}
                              </div>
                            </td>
                            <td>
                              <span className="badge bg-secondary">
                                {user.group.description}
                              </span>
                            </td>
                            <td>
                              <div className="d-flex gap-1 justify-content-center">
                                <button
                                  className="btn btn-warning btn-sm"
                                  onClick={() => openModal("edit", user)}
                                  title="Edit User"
                                >
                                  <FontAwesomeIcon icon={faPencil} />
                                </button>
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => openModal("delete", user)}
                                  title="Delete User"
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="d-block d-md-none">
                  {userList.length === 0 ? (
                    <div className="text-center py-5">
                      <div className="text-muted">
                        <i className="fas fa-users fa-3x mb-3"></i>
                        <p>No users found</p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3">
                      {userList.map((user, index) => (
                        <div key={user.id} className="card mb-3 border">
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <div>
                                <h6 className="card-title mb-1">
                                  #{(currentPage - 1) * currentLimit + index + 1} - {user.username}
                                </h6>
                                <span className="badge bg-secondary mb-2">
                                  {user.group.description}
                                </span>
                              </div>
                              <div className="dropdown">
                                <button
                                  className="btn btn-outline-secondary btn-sm dropdown-toggle"
                                  type="button"
                                  data-bs-toggle="dropdown"
                                >
                                  Actions
                                </button>
                                <ul className="dropdown-menu">
                                  <li>
                                    <button
                                      className="dropdown-item"
                                      onClick={() => openModal("edit", user)}
                                    >
                                      Edit
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      className="dropdown-item text-danger"
                                      onClick={() => openModal("delete", user)}
                                    >
                                      Delete
                                    </button>
                                  </li>
                                </ul>
                              </div>
                            </div>
                            
                            <div className="row g-2 small text-muted">
                              <div className="col-12">
                                <strong>ID:</strong> {user.id}
                              </div>
                              <div className="col-12">
                                <strong>Email:</strong> 
                                <div className="text-break">{user.email}</div>
                              </div>
                              <div className="col-12">
                                <strong>Phone:</strong> {user.phone}
                              </div>
                              <div className="col-12">
                                <strong>Address:</strong> 
                                <div className="text-break">{user.address}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination */}
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
          />
        </div>
      )}

      <UserModal
        showModal={showModal}
        typeModal={typeModal}
        selectedUser={selectedUser}
        formData={formData}
        errors={errors}
        refs={{
          emailRef,
          usernameRef,
          passwordRef,
          confirmPasswordRef,
          phoneRef,
          addressRef,
          groupRef,
        }}
        onClose={closeModal}
        onSubmitAdd={handleSubmitAdd}
        onSubmitEdit={handleSubmitEdit}
        onConfirmDelete={confirmDelete}
        onFieldChange={handleFieldChange}
      />
    </div>
  );
}

export default UserDashboard;