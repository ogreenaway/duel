import { Route, Routes } from "react-router-dom";

import PageNotFound from "./not_found/PageNotFound";
import ProgramsScreen from "./programs/ProgramsScreen";
import TasksScreen from "./tasks/TasksScreen";
import TopUsersReportScreen from "./reports/top_users/TopUsersReportScreen";
import UsersScreen from "./users/UsersScreen";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/tasks" element={<TasksScreen />} />
      <Route path="/programs" element={<ProgramsScreen />} />
      <Route path="/users" element={<UsersScreen />} />
      <Route path="/reports/top-users" element={<TopUsersReportScreen />} />
      <Route path="/" element={<TasksScreen />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default AppRoutes;
