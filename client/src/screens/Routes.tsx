import { Route, Routes } from "react-router-dom";

import PageNotFound from "./not_found/PageNotFound";
import TasksScreen from "./tasks/TasksScreen";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/tasks" element={<TasksScreen />} />
      <Route path="/" element={<TasksScreen />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default AppRoutes;
