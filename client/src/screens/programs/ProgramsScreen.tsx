import { Container } from "react-bootstrap";
import NavBar from "../../components/NavBar";
import ProgramsTable from "./programs_table/ProgramsTable";

const ProgramsScreen = () => {
  return (
    <>
      <NavBar />
      <Container>
        <h1 className="text-center m-4 text-decoration-underline">Programs</h1>
        <ProgramsTable />
      </Container>
    </>
  );
};

export default ProgramsScreen;
