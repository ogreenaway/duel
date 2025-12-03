import { Alert, Card, Container, Spinner } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import NavBar from "../../components/NavBar";
import { Task } from "../../types/TaskModel";

const TaskScreen = () => {
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const getTask = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/tasks/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch task");
        }
        const data = await response.json();
        setTask(data);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    getTask();
  }, [id]);

  if (loading) {
    return (
      <>
        <NavBar />
        <Container className="mt-4">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Container>
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavBar />
        <Container className="mt-4">
          <Alert variant="danger">{error.message}</Alert>
        </Container>
      </>
    );
  }

  if (!task) {
    return (
      <>
        <NavBar />
        <Container className="mt-4">
          <Alert variant="warning">Task not found</Alert>
        </Container>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <Container className="mt-4">
        <h1 className="mb-4">Task Details</h1>

        <Card>
          <Card.Header>Basic Information</Card.Header>
          <Card.Body>
            <Card.Text>
              <p>
                <strong>Task ID:</strong> {task._id}
              </p>
              <p>
                <strong>Legacy Task ID:</strong> {task.legacy_task_id}
              </p>
              <p>
                <strong>User ID:</strong>{" "}
                <Link to={`/users/${task.user_id}`}>{task.user_id}</Link>
              </p>
              <p>
                <strong>Program ID:</strong> {task.program_id}
              </p>
              <p className="mb-0">
                <strong>Platform:</strong> {task.platform || "Not provided"}
              </p>
            </Card.Text>
          </Card.Body>
        </Card>

        <Card className="mt-4">
          <Card.Header>Post Information</Card.Header>
          <Card.Body>
            <Card.Text>
              {task.post_url ? (
                <p className="mb-0">
                  <strong>Post URL:</strong>{" "}
                  <a
                    href={task.post_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {task.post_url}
                  </a>
                </p>
              ) : (
                <p className="mb-0">
                  <strong>Post URL:</strong> Not provided
                </p>
              )}
            </Card.Text>
          </Card.Body>
        </Card>

        <Card className="mt-4">
          <Card.Header>Engagement Metrics</Card.Header>
          <Card.Body>
            <Card.Text>
              <p>
                <strong>Likes:</strong> {task.likes ?? "Not provided"}
              </p>
              <p>
                <strong>Comments:</strong> {task.comments ?? "Not provided"}
              </p>
              <p>
                <strong>Shares:</strong> {task.shares ?? "Not provided"}
              </p>
              <p className="mb-0">
                <strong>Reach:</strong> {task.reach ?? "Not provided"}
              </p>
            </Card.Text>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default TaskScreen;
