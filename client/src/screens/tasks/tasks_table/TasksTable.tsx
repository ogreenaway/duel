import { Alert, Spinner, Table } from "react-bootstrap";
import { useEffect, useState } from "react";

import LimitSelector from "../../../components/LimitSelector";
import { Link } from "react-router-dom";
import { Pagination } from "../../../types/pagination";
import TablePagination from "../../../components/Pagination";
import { Task } from "../../../../../server/src/models/TaskModel";

interface GetTasksProps {
  currentPage: number;
  currentLimit: number;
  setTasks: (tasks: Task[]) => void;
  setPagination: (pagination: Pagination) => void;
  setError: (error: Error) => void;
  setLoading: (loading: boolean) => void;
}

const getTasks = async ({
  currentPage,
  currentLimit,
  setTasks,
  setPagination,
  setError,
  setLoading,
}: GetTasksProps) => {
  setLoading(true);
  try {
    const response = await fetch(
      `http://localhost:5000/tasks?page=${currentPage}&limit=${currentLimit}`
    );
    const data = await response.json();
    setTasks(data.data);
    setPagination(data.pagination);
  } catch (error) {
    setError(error as Error);
  } finally {
    setLoading(false);
  }
};

const TasksTable = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(10);

  useEffect(() => {
    getTasks({
      currentPage,
      currentLimit,
      setTasks,
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
            <th>Task ID</th>
            {/* <th>Legacy Task ID</th> */}
            <th>Platform</th>
            <th>Post URL</th>
            <th>Likes</th>
            <th>Comments</th>
            <th>Shares</th>
            <th>Reach</th>
            <th>Completed By</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id.toString()}>
              <td>{task._id.toString()}</td>
              {/* <td>{task.legacy_task_id}</td> */}
              <td>{task.platform}</td>
              <td>{task.post_url}</td>
              <td>{task.likes}</td>
              <td>{task.comments}</td>
              <td>{task.shares}</td>
              <td>{task.reach}</td>
              <td>
                <Link to={`/users/${task.user_id}`}>View User</Link>
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

export default TasksTable;
