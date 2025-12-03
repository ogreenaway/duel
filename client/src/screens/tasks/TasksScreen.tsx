import { Container } from "react-bootstrap";
import NavBar from "../../components/NavBar";
import TasksTable from "./tasks_table/TasksTable";

const TasksScreen = () => {
  return (
    <>
      <NavBar />
      <Container>
        <h1 className="text-center m-4 text-decoration-underline">Tasks</h1>
        <TasksTable />
      </Container>
    </>
  );
};

export default TasksScreen;
