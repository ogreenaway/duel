import { Container } from "react-bootstrap";
import NavBar from "../../../components/NavBar";
import TopProgramReportTable from "./top_programs_report_table/TopProgramReportTable";

const TopProgramReportScreen = () => {
  return (
    <>
      <NavBar />
      <Container>
        <h1 className="text-center m-4 text-decoration-underline">Top Programs Report</h1>
        <TopProgramReportTable />
      </Container>
    </>
  );
};

export default TopProgramReportScreen;

