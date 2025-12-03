import { Route, Routes } from "react-router-dom";

import PageNotFound from "./not_found/PageNotFound";
import ProgramsScreen from "./programs/ProgramsScreen";
import TasksScreen from "./tasks/TasksScreen";
import UsersScreen from "./users/UsersScreen";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/tasks" element={<TasksScreen />} />
      <Route path="/programs" element={<ProgramsScreen />} />
      <Route path="/users" element={<UsersScreen />} />
      <Route path="/" element={<TasksScreen />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default AppRoutes;
