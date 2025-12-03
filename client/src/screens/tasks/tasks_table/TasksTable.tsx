import { Spinner, Table } from "react-bootstrap";
import { useEffect, useState } from "react";

import { Task } from "../../../../../server/src/models/TaskModel";

const TasksTable = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const getTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/tasks");
      const data = await response.json();
      setTasks(data.data);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  if (loading) {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }

  return (
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
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TasksTable;
