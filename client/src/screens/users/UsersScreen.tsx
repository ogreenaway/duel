import { Container } from "react-bootstrap";
import NavBar from "../../components/NavBar";
import UsersTable from "./users_table/UsersTable";

const UsersScreen = () => {
  return (
    <>
      <NavBar />
      <Container>
        <h1 className="text-center m-4 text-decoration-underline">Users</h1>
        <UsersTable />
      </Container>
    </>
  );
};

export default UsersScreen;
