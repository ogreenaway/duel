import { Route, Routes } from "react-router-dom";

import PageNotFound from "./not_found/PageNotFound";
import ProgramScreen from "./programs/ProgramScreen";
import ProgramsScreen from "./programs/ProgramsScreen";
import StatisticsScreen from "./statistics/StatisticsScreen";
import TaskScreen from "./tasks/TaskScreen";
import TasksScreen from "./tasks/TasksScreen";
import TopProgramReportScreen from "./reports/top_programs/TopProgramReportScreen";
import TopUsersReportScreen from "./reports/top_users/TopUsersReportScreen";
import UserScreen from "./users/UserScreen";
import UsersScreen from "./users/UsersScreen";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/tasks/:id" element={<TaskScreen />} />
      <Route path="/tasks" element={<TasksScreen />} />
      <Route path="/programs/:id" element={<ProgramScreen />} />
      <Route path="/programs" element={<ProgramsScreen />} />
      <Route path="/users/:id" element={<UserScreen />} />
      <Route path="/users" element={<UsersScreen />} />
      <Route path="/reports/top-users" element={<TopUsersReportScreen />} />
      <Route
        path="/reports/top-programs"
        element={<TopProgramReportScreen />}
      />
      <Route path="/reports/statistics" element={<StatisticsScreen />} />
      <Route path="/" element={<TasksScreen />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default AppRoutes;
