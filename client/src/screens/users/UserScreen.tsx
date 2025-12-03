import { Alert, Card, Container, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";

import Currency from "../../components/Currency";
import NavBar from "../../components/NavBar";
import { User } from "../../types/UserModel";
import { useParams } from "react-router-dom";

const UserScreen = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const getUser = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/users/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }
        const data = await response.json();
        setUser(data);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    getUser();
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

  if (!user) {
    return (
      <>
        <NavBar />
        <Container className="mt-4">
          <Alert variant="warning">User not found</Alert>
        </Container>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <Container className="mt-4">
        <h1 className="mb-4">User Details</h1>

        <Card>
          <Card.Header>Basic Information</Card.Header>
          <Card.Body>
            <Card.Text>
              <p>
                <strong>User ID:</strong> {user._id}
              </p>
              <p>
                <strong>Legacy User ID:</strong>{" "}
                {String(user.legacy_user_id) || "Not provided"}
              </p>

              <p>
                <strong>Name:</strong> {user.name || "Not provided"}
              </p>

              <p>
                <strong>Email:</strong> {user.email || "Not provided"}
              </p>

              <p className="mb-0">
                <strong>Joined At:</strong> {user.joined_at || "Not provided"}
              </p>
            </Card.Text>
          </Card.Body>
        </Card>

        <Card className="mt-4">
          <Card.Header>Social Media Handles</Card.Header>
          <Card.Body>
            <Card.Text>
              <p>
                <strong>Instagram:</strong>{" "}
                {user.instagram_handle || "Not provided"}
              </p>
              <p className="mb-0">
                <strong>TikTok:</strong> {user.tiktok_handle || "Not provided"}
              </p>
            </Card.Text>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default UserScreen;
