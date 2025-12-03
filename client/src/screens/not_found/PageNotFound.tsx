import { Alert, Container } from "react-bootstrap";

import NavBar from "../../components/NavBar";

const PageNotFound = () => {
  return (
    <>
      <NavBar />
      <Container>
        <Alert variant={"danger"} className="m-3">
          Page not found
        </Alert>
      </Container>
    </>
  );
};

export default PageNotFound;
