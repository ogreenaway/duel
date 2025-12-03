import { Container, Nav, Navbar } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

const NavBar = () => {
  const location = useLocation();

  return (
    <Navbar bg="dark" data-bs-theme="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto" activeKey={location.pathname}>
            <Nav.Link as={Link} to="/" href="/">
              Tasks
            </Nav.Link>
            <Nav.Link as={Link} to="/programs" href="/programs">
              Programs
            </Nav.Link>
            <Nav.Link as={Link} to="/users" href="/users">
              Users
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/reports/top-users"
              href="/reports/top-users"
            >
              Top Users
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/reports/top-programs"
              href="/reports/top-programs"
            >
              Top Programs
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/reports/statistics"
              href="/reports/statistics"
            >
              Statistics
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
