import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/dashboardPage";
import ResumeUploaderPage from "../pages/ResumeUploaderPage";

const Routers = () => {
  const routers = [
    {
      path: "/dashboard",
      element: <DashboardPage />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/upload-resume",
      element: <ResumeUploaderPage />,
    },
  ];

  return (
    <Routes>
      {routers.map((route, index) => (
        <Route key={index} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
};

export default Routers;
