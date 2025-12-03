import { Container, Nav, Navbar } from "react-bootstrap";

const NavBar = () => {
  return (
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
  );
};

export default NavBar;
