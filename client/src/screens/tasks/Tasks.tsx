import { Container, Nav, Navbar } from "react-bootstrap";

import TasksTable from "./tasks_table/TasksTable";

const TasksScreen = () => {
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark" expand="lg">
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto" activeKey="/tasks">
              <Nav.Link href="/tasks">Tasks</Nav.Link>
              <Nav.Link href="/programs">Programs</Nav.Link>
              <Nav.Link href="/users">Users</Nav.Link>
              <Nav.Link href="/reports">Reports</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>
        <h1 className="text-center m-4 text-decoration-underline">Tasks</h1>
        <TasksTable />
      </Container>
    </>
  );
};

export default TasksScreen;
