import React, { useEffect, useState } from "react";
import { getGroupList } from "../../services/userService";
import handleErrorFetchApi from "../UI/HandleErrorFetchApi";
import ClipLoader from "react-spinners/ClipLoader";

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
};

type Group = {
  id: number;
  name: string;
  description: string;
};

interface UserModalProps {
  showModal: boolean;
  typeModal: "add" | "edit" | "delete";
  selectedUser: User | null;
  formData: any;
  errors: { [key: string]: string };
  refs: {
    emailRef: React.RefObject<HTMLInputElement | null>;
    usernameRef: React.RefObject<HTMLInputElement | null>;
    passwordRef: React.RefObject<HTMLInputElement | null>;
    confirmPasswordRef: React.RefObject<HTMLInputElement | null>;
    phoneRef: React.RefObject<HTMLInputElement | null>;
    addressRef: React.RefObject<HTMLInputElement | null>;
    groupRef: React.RefObject<HTMLSelectElement | null>;
  };
  onClose: () => void;
  onSubmitAdd: (e: React.FormEvent) => void;
  onSubmitEdit: (e: React.FormEvent) => void;
  onConfirmDelete: () => void;
  onFieldChange: (field: string, value: string | number) => void;
  isSubmitting?: boolean;
  isDeleting?: boolean;
}

const UserModal: React.FC<UserModalProps> = ({
  showModal,
  typeModal,
  selectedUser,
  formData,
  errors,
  refs,
  onClose,
  onSubmitAdd,
  onSubmitEdit,
  onConfirmDelete,
  onFieldChange,
  isSubmitting,
  isDeleting,
}) => {
  const [groupList, setGroupList] = useState<Group[]>([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false); // ✅ Add loading state

  useEffect(() => {
    if (showModal) {
      // Only fetch when modal is shown
      fetchGroupList();
    }
  }, [showModal]);

  const fetchGroupList = async () => {
    try {
      setIsLoadingGroups(true); // ✅ Start loading
      const response = await getGroupList();
      if (response.status === 200) {
        setGroupList(response.data.data);
      }
    } catch (error) {
      handleErrorFetchApi.handleGetGroupListError(error);
    } finally {
      setIsLoadingGroups(false); // ✅ Stop loading
    }
  };

  if (!showModal) return null;

  // Helper for rendering form rows
  const renderFormRows = (isAdd: boolean) => (
    <>
      {/* Row 1: Email & Username */}
      <div className="row g-3 mb-3">
        <div className="col-12 col-sm-6">
          <span className="form-label">
            Email: <span className="text-danger">*</span>
          </span>
          <input
            ref={refs.emailRef}
            type="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            value={formData.email}
            onChange={(e) => onFieldChange("email", e.target.value)}
            disabled={!isAdd}
          />
          {errors.email && (
            <div className="invalid-feedback">{errors.email}</div>
          )}
        </div>
        <div className="col-12 col-sm-6">
          <span className="form-label">
            Username: <span className="text-danger">*</span>
          </span>
          <input
            ref={refs.usernameRef}
            type="text"
            className={`form-control ${errors.username ? "is-invalid" : ""}`}
            value={formData.username}
            onChange={(e) => onFieldChange("username", e.target.value)}
          />
          {errors.username && (
            <div className="invalid-feedback">{errors.username}</div>
          )}
        </div>
      </div>

      {/* Row 2: Password & Confirm Password (only for add) */}
      {isAdd && (
        <div className="row g-3 mb-3">
          <div className="col-12 col-sm-6">
            <span className="form-label">
              Password: <span className="text-danger">*</span>
            </span>
            <input
              ref={refs.passwordRef}
              type="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              value={formData.password}
              onChange={(e) => onFieldChange("password", e.target.value)}
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password}</div>
            )}
          </div>
          <div className="col-12 col-sm-6">
            <span className="form-label">
              Confirm Password: <span className="text-danger">*</span>
            </span>
            <input
              ref={refs.confirmPasswordRef}
              type="password"
              className={`form-control ${
                errors.confirmPassword ? "is-invalid" : ""
              }`}
              value={formData.confirmPassword}
              onChange={(e) => onFieldChange("confirmPassword", e.target.value)}
            />
            {errors.confirmPassword && (
              <div className="invalid-feedback">{errors.confirmPassword}</div>
            )}
          </div>
        </div>
      )}

      {/* Row 3: Phone & Gender */}
      <div className="row g-3 mb-3">
        <div className="col-12 col-sm-8">
          <span className="form-label">
            Phone: <span className="text-danger">*</span>
          </span>
          <input
            ref={refs.phoneRef}
            type="tel"
            className={`form-control ${errors.phone ? "is-invalid" : ""}`}
            value={formData.phone}
            onChange={(e) => onFieldChange("phone", e.target.value)}
            disabled={!isAdd}
          />
          {errors.phone && (
            <div className="invalid-feedback">{errors.phone}</div>
          )}
        </div>
        <div className="col-12 col-sm-4">
          <span className="form-label">Gender:</span>
          <select
            className="form-select"
            value={formData.gender}
            onChange={(e) => onFieldChange("gender", e.target.value)}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>

      {/* Row 4: Address & Group */}
      <div className="row g-3">
        <div className="col-12 col-sm-7">
          <span className="form-label">
            Address: <span className="text-danger">*</span>
          </span>
          <input
            ref={refs.addressRef}
            type="text"
            className={`form-control ${errors.address ? "is-invalid" : ""}`}
            value={formData.address}
            onChange={(e) => onFieldChange("address", e.target.value)}
          />
          {errors.address && (
            <div className="invalid-feedback">{errors.address}</div>
          )}
        </div>
        <div className="col-12 col-sm-5">
          <span className="form-label">
            Group: <span className="text-danger">*</span>
          </span>
          <div className="position-relative">
            <select
              ref={refs.groupRef}
              className={`form-select ${errors.groupId ? "is-invalid" : ""}`}
              value={formData.groupId}
              onChange={(e) => onFieldChange("groupId", Number(e.target.value))}
              disabled={isLoadingGroups}
            >
              <option value={0}>
                {isLoadingGroups ? "Loading groups..." : "Select Group"}
              </option>
              {!isLoadingGroups &&
                groupList?.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name} - {group.description}
                  </option>
                ))}
            </select>

            {/* ✅ Loading spinner inside select */}
            {isLoadingGroups && (
              <div
                className="position-absolute top-50 end-0 translate-middle-y me-3"
                style={{ pointerEvents: "none" }}
              >
                <ClipLoader size={16} color="#6c757d" />
              </div>
            )}
          </div>

          {errors.groupId && (
            <div className="invalid-feedback">{errors.groupId}</div>
          )}
        </div>
      </div>
    </>
  );

  // Helper for rendering modal header
  const renderModalHeader = (title: string) => (
    <div className="modal-header">
      <h5 className="modal-title">{title}</h5>
      <button type="button" className="btn-close" onClick={onClose}></button>
    </div>
  );

  // Helper for rendering modal footer
  const renderModalFooter = (
    submitClass: string,
    onSubmitType: "add" | "edit" | "delete"
  ) => (
    <div className="modal-footer d-flex flex-column flex-sm-row gap-2">
      <button
        type="button"
        className="btn btn-secondary flex-fill flex-sm-grow-0 order-2 order-sm-1"
        onClick={onClose}
      >
        Cancel
      </button>
      {onSubmitType === "delete" ? (
        <button
          type="button"
          className={`btn ${submitClass} flex-fill flex-sm-grow-0 order-1 order-sm-2`}
          onClick={onConfirmDelete}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <>
              <ClipLoader size={16} color="#fff" />
              <span className="ms-2">Deleting...</span>
            </>
          ) : (
            "Delete"
          )}
        </button>
      ) : (
        (() => {
          let buttonText = "";
          if (isSubmitting) {
            buttonText = (
              <>
                <ClipLoader size={16} color="#fff" />
                <span className="ms-2">Saving...</span>
              </>
            ) as unknown as string;
          } else {
            buttonText = typeModal === "add" ? "Add User" : "Update User";
          }
          return (
            <button
              type="submit"
              className={`btn ${submitClass} flex-fill flex-sm-grow-0 order-1 order-sm-2`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <ClipLoader size={16} color="#fff" />
                  <span className="ms-2">Saving...</span>
                </>
              ) : (
                buttonText
              )}
            </button>
          );
        })()
      )}
    </div>
  );

  const renderDeleteBody = () => (
    <div className="modal-body text-center">
      <div className="mb-3">
        <i
          className="fas fa-exclamation-triangle text-danger"
          style={{ fontSize: "3rem" }}
        ></i>
      </div>
      <h6 className="mb-3">Are you sure you want to delete this user?</h6>
      {selectedUser && (
        <div className="alert alert-danger">
          <div>
            <strong>Username:</strong> {selectedUser.username}
          </div>
          <div>
            <strong>Email:</strong> {selectedUser.email}
          </div>
        </div>
      )}
    </div>
  );

  const renderModalContent = () => {
    if (typeModal === "add" || typeModal === "edit") {
      return (
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
          <div className="modal-content">
            {renderModalHeader(
              typeModal === "add" ? "Add New User" : "Edit User"
            )}
            <form onSubmit={typeModal === "add" ? onSubmitAdd : onSubmitEdit}>
              <div className="modal-body">
                <div className="container-fluid px-0">
                  {renderFormRows(typeModal === "add")}
                </div>
              </div>
              {renderModalFooter(
                typeModal === "add" ? "btn-primary" : "btn-warning",
                typeModal
              )}
            </form>
          </div>
        </div>
      );
    }
    if (typeModal === "delete") {
      return (
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            {renderModalHeader("Delete User")}
            {renderDeleteBody()}
            {renderModalFooter("btn-danger", "delete")}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className="modal show d-block"
      tabIndex={-1}
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      {renderModalContent()}
    </div>
  );
};

export default UserModal;
