import React from "react";
import { ClipLoader } from "react-spinners";

type Role = {
  id: number;
  url: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

interface RoleModalProps {
  showModal: boolean;
  typeModal: "edit" | "delete";
  selectedRole?: Role;
  formData: {
    url: string;
    description: string;
  };
  errors: { [key: string]: string };
  refs: {
    urlRef: React.RefObject<HTMLInputElement | null>;
  };
  onClose: () => void;
  onSubmitEdit: (e: React.FormEvent) => void;
  onConfirmDelete: () => void;
  onFieldChange: (field: string, value: string) => void;
  isSubmitting?: boolean;
  isDeleting?: boolean;
}

const RoleModal: React.FC<RoleModalProps> = ({
  showModal,
  typeModal,
  selectedRole,
  formData,
  errors,
  refs,
  onClose,
  onSubmitEdit,
  onConfirmDelete,
  onFieldChange,
  isSubmitting = false,
  isDeleting = false,
}) => {
  if (!showModal) return null;

  // Helper for rendering form rows
  const renderFormRows = () => (
    <>
      {/* Row 1: URL */}
      <div className="row g-3 mb-3">
        <div className="col-12">
          <label htmlFor="role-url" className="form-label">
            URL: <span className="text-danger">*</span>
          </label>
          <input
            id="role-url"
            ref={refs.urlRef}
            type="text"
            className={`form-control ${errors.url ? "is-invalid" : ""}`}
            value={formData.url}
            onChange={(e) => onFieldChange("url", e.target.value)}
            placeholder="/api/endpoint"
            disabled={isSubmitting}
          />
          {errors.url && (
            <div className="invalid-feedback">{errors.url}</div>
          )}
          <div className="form-text">
            URL must start with '/' and contain only letters, numbers, hyphens, underscores, or forward slashes
          </div>
        </div>
      </div>

      {/* Row 2: Description */}
      <div className="row g-3">
        <div className="col-12">
          <label htmlFor="role-description" className="form-label">
            Description:
          </label>
          <input
            id="role-description"
            type="text"
            className={`form-control ${errors.description ? "is-invalid" : ""}`}
            value={formData.description}
            onChange={(e) => onFieldChange("description", e.target.value)}
            placeholder="Role description (optional)"
            disabled={isSubmitting}
          />
        </div>
      </div>
    </>
  );

  // Helper for rendering modal header
  const renderModalHeader = (title: string) => (
    <div className="modal-header">
      <h5 className="modal-title d-flex align-items-center">
        <i className="fas fa-user-shield me-2 text-primary"></i>
        {title}
      </h5>
      <button 
        type="button" 
        className="btn-close" 
        onClick={onClose}
        disabled={isSubmitting || isDeleting}
        aria-label="Close"
      ></button>
    </div>
  );

  // Helper for rendering modal footer
  const renderModalFooter = (
    submitClass: string,
    onSubmitType: "edit" | "delete"
  ) => (
    <div className="modal-footer d-flex flex-column flex-sm-row gap-2">
      <button
        type="button"
        className="btn btn-secondary flex-fill flex-sm-grow-0 order-2 order-sm-1"
        onClick={onClose}
        disabled={isSubmitting || isDeleting}
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
            <>
              Delete Role
            </>
          )}
        </button>
      ) : (
        <button
          type="submit"
          className={`btn ${submitClass} flex-fill flex-sm-grow-0 order-1 order-sm-2`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <ClipLoader size={16} color="#fff" />
              <span className="ms-2">Updating...</span>
            </>
          ) : (
            <>
              Update Role
            </>
          )}
        </button>
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
      <h6 className="mb-3">
        Are you sure you want to delete this role?
      </h6>
      {selectedRole && (
        <div className="alert alert-danger">
          <div className="d-flex flex-column gap-2">
            <div>
              <strong>URL:</strong> 
              <code className="ms-2 text-danger">{selectedRole.url}</code>
            </div>
            <div>
              <strong>Description:</strong> 
              <span className="ms-2">
                {selectedRole.description || <em>No description</em>}
              </span>
            </div>
          </div>
        </div>
      )}
      <p className="text-muted small mb-0">
        This action cannot be undone. The role will be permanently deleted.
      </p>
    </div>
  );

  const renderModalContent = () => {
    if (typeModal === "edit") {
      return (
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            {renderModalHeader("Edit Role")}
            <form onSubmit={onSubmitEdit}>
              <div className="modal-body">
                <div className="container-fluid px-0">
                  {renderFormRows()}
                </div>
              </div>
              {renderModalFooter("btn-warning", typeModal)}
            </form>
          </div>
        </div>
      );
    }
    
    if (typeModal === "delete") {
      return (
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            {renderModalHeader("Delete Role")}
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

export default RoleModal;
