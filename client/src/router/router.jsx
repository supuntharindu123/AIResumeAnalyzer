import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/dashboardPage";
import ResumeUploaderPage from "../pages/ResumeUploaderPage";
import VerifyEmailPage from "../pages/VerifyEmailPage";
import ForgotPasswordPage from "../pages/forgetPasswordPage";
import Header from "../component/header";
import Footer from "../component/footer";

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
    {
      path: "/verify-email",
      element: <VerifyEmailPage />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPasswordPage />,
    },
  ];

  return (
    <div>
      <Header />
      <Routes>
        {routers.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
      <Footer />
    </div>
  );
};

export default Routers;
