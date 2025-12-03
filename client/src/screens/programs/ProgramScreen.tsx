import { Alert, Card, Container, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Currency from "../../components/Currency";
import NavBar from "../../components/NavBar";
import { Program } from "../../types/ProgramModel";

const ProgramScreen = () => {
  const { id } = useParams<{ id: string }>();
  const [program, setProgram] = useState<Program | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const getProgram = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/programs/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch program");
        }
        const data = await response.json();
        setProgram(data);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    getProgram();
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

  if (!program) {
    return (
      <>
        <NavBar />
        <Container className="mt-4">
          <Alert variant="warning">Program not found</Alert>
        </Container>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <Container className="mt-4">
        <h1 className="mb-4">Program Details</h1>

        <Card>
          <Card.Header>Basic Information</Card.Header>
          <Card.Body>
            <Card.Text>
              <p>
                <strong>Program ID:</strong> {program._id}
              </p>
              <p>
                <strong>Legacy Program ID:</strong> {program.legacy_program_id}
              </p>
              <p>
                <strong>User ID:</strong>{" "}
                <Link to={`/users/${program.user_id}`}>{program.user_id}</Link>
              </p>
              <p>
                <strong>Brand:</strong> {program.brand || "Not provided"}
              </p>
              <p className="mb-0">
                <strong>Total Sales Attributed:</strong>{" "}
                <Currency value={program.total_sales_attributed} />
              </p>
            </Card.Text>
          </Card.Body>
        </Card>

        {program.tasks_completed && program.tasks_completed.length > 0 && (
          <Card className="mt-4">
            <Card.Header>Tasks Completed ({program.tasks_completed.length})</Card.Header>
            <Card.Body>
              {program.tasks_completed.map((task, index) => (
                <Card key={task._id || index} className="mb-3">
                  <Card.Body>
                    <p>
                      <strong>Task ID:</strong>{" "}
                      <Link to={`/tasks/${task._id}`}>{task._id}</Link>
                    </p>
                    <p>
                      <strong>Legacy Task ID:</strong> {task.legacy_task_id}
                    </p>
                    <p>
                      <strong>Platform:</strong> {task.platform || "Not provided"}
                    </p>
                    {task.post_url && (
                      <p>
                        <strong>Post URL:</strong>{" "}
                        <a href={task.post_url} target="_blank" rel="noopener noreferrer">
                          {task.post_url}
                        </a>
                      </p>
                    )}
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
                  </Card.Body>
                </Card>
              ))}
            </Card.Body>
          </Card>
        )}
      </Container>
    </>
  );
};

export default ProgramScreen;

