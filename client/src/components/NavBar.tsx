import { Container, Nav, Navbar } from "react-bootstrap";

import { useLocation } from "react-router-dom";

const NavBar = () => {
  const location = useLocation();

  return (
    <Navbar bg="dark" data-bs-theme="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto" activeKey={location.pathname}>
            <Nav.Link href="/">Tasks</Nav.Link>
            <Nav.Link href="/programs">Programs</Nav.Link>
            <Nav.Link href="/users">Users</Nav.Link>
            <Nav.Link href="/reports/top-users">Top Users</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
