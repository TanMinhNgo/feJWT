import "./UserDashboard.scss";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import handleErrorFetchApi from "../UI/HandleErrorFetchApi";
import { getAllUsers } from "../../services/userService";

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
  const [currentLimit, setCurrentLimit] = useState(2);
  const [totalPages, setTotalPages] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const storedAuthData = sessionStorage.getItem("authData");
    if (!storedAuthData) {
      navigate("/login");
    } else {
      fetchApi();
    }
  }, [currentPage]);

  const fetchApi = async () => {
    try {
      const response = await getAllUsers(currentPage, currentLimit);

      if (response.status === 200) {
        setUserList(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      handleErrorFetchApi.handleGetAllUsersError(error);
    }
  };

  const handlePageClick = async (data: { selected: number }) => {
    const selectedPage = data.selected + 1; // ReactPaginate uses zero-based index
    setCurrentPage(selectedPage);
  };

  return (
    <div className="manage-users-container container">
      <div className="user-header d-flex flex-column justify-content-center align-items-center">
        <div className="title">
          <h3>User Dashboard</h3>
        </div>

        <div className="actions d-flex gap-2 mt-3">
          <button className="btn btn-success" onClick={fetchApi}>
            Refresh
          </button>
          <button className="btn btn-primary">Add new User</button>
        </div>
      </div>

      <div className="user-list">
        <div className="table-user mt-5">
          <div className="table-header">
            <h3>User List</h3>
          </div>
          <table className="table table-hover table-bordered">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Id</th>
                <th scope="col">Email</th>
                <th scope="col">Username</th>
                <th scope="col">Phone</th>
                <th scope="col">Address</th>
                <th scope="col">Group</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {userList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center">
                    No users found
                  </td>
                </tr>
              ) : (
                <>
                  {userList.map((user, index) => (
                    <tr key={user.id}>
                      <th scope="row">{index + 1}</th>
                      <td>{user.id}</td>
                      <td>{user.email}</td>
                      <td>{user.username}</td>
                      <td>{user.phone}</td>
                      <td>{user.address}</td>
                      <td>
                        {user.group.name}: {user.group.description}
                      </td>
                      <td className="d-flex gap-2">
                        <form
                          action={`/user/update-user-page/${user.id}`}
                          method="post"
                        >
                          <button className="btn btn-warning btn-sm">
                            Edit
                          </button>
                        </form>
                        <form
                          action={`/user/delete-user/${user.id}`}
                          method="post"
                        >
                          <button
                            className="btn btn-danger btn-sm"
                            type="submit"
                            onClick={() => window.confirm("Are you sure?")}
                          >
                            Delete
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 0 && (
        <div className="user-footer">
          <ReactPaginate
            previousLabel={"< previous"}
            nextLabel={"next >"}
            breakLabel={"..."}
            pageCount={totalPages}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageClick}
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            nextClassName="page-item"
            breakClassName="page-item"
            previousLinkClassName="page-link"
            nextLinkClassName="page-link"
            breakLinkClassName="page-link"
            containerClassName="pagination"
            activeClassName="active"
            renderOnZeroPageCount={null}
          />
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
