import { Container } from "react-bootstrap";
import NavBar from "../../../components/NavBar";
import TopUsersReportTable from "./top_users_report_table/TopUsersReportTable";

const TopUsersReportScreen = () => {
  return (
    <>
      <NavBar />
      <Container>
        <h1 className="text-center m-4 text-decoration-underline">Top Users Report</h1>
        <TopUsersReportTable />
      </Container>
    </>
  );
};

export default TopUsersReportScreen;

