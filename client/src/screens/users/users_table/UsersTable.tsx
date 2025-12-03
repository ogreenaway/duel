import { Alert, Spinner, Table } from "react-bootstrap";
import { useEffect, useState } from "react";

import FormatDate from "../../../components/FormatDate";
import LimitSelector from "../../../components/LimitSelector";
import { Link } from "react-router-dom";
import { Pagination } from "../../../types/pagination";
import TablePagination from "../../../components/Pagination";
import { User } from "../../../types/UserModel";

interface GetUsersProps {
  currentPage: number;
  currentLimit: number;
  setUsers: (users: User[]) => void;
  setPagination: (pagination: Pagination) => void;
  setError: (error: Error) => void;
  setLoading: (loading: boolean) => void;
}

const getUsers = async ({
  currentPage,
  currentLimit,
  setUsers,
  setPagination,
  setError,
  setLoading,
}: GetUsersProps) => {
  setLoading(true);
  try {
    const response = await fetch(
      `http://localhost:5000/users?page=${currentPage}&limit=${currentLimit}`,
    );
    const data = await response.json();
    setUsers(data.data);
    setPagination(data.pagination);
  } catch (error) {
    setError(error as Error);
  } finally {
    setLoading(false);
  }
};

const UsersTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(10);

  useEffect(() => {
    getUsers({
      currentPage,
      currentLimit,
      setUsers,
      setPagination,
      setError,
      setLoading,
    });
  }, [currentPage, currentLimit]);

  if (error) {
    return <Alert variant={"danger"}>{error.message}</Alert>;
  }

  if (loading) {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }

  return (
    <>
      <Table responsive striped>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Instagram Handle</th>
            <th>TikTok Handle</th>
            <th>Joined</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>
                <Link to={`/users/${user._id}`}>{user._id}</Link>
              </td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.instagram_handle}</td>
              <td>{user.tiktok_handle}</td>
              <td>
                <FormatDate date={user.joined_at} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <TablePagination
          pagination={pagination}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
        <LimitSelector
          currentLimit={currentLimit}
          setCurrentLimit={setCurrentLimit}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </>
  );
};

export default UsersTable;
