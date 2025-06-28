import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/dashboardPage";
import ResumeUploaderPage from "../pages/ResumeUploaderPage";
import VerifyEmailPage from "../pages/VerifyEmailPage";
import ForgotPasswordPage from "../pages/forgetPasswordPage";
import Header from "../component/header";
import Footer from "../component/footer";
import { useAuth } from "../context/authcontext";
import PrivateRoute from "./privateroute";
import ProfilePage from "../pages/profilePage";
import AnalysisResultsPage from "../pages/AnalysisResultsPage";
import HomePage from "../pages/homePage";
import AboutPage from "../pages/aboutPage";
import ResumePage from "../pages/ResumePage";
import FaqPage from "../pages/FaqPage";

const Routers = () => {
  const auth = useAuth();
  const routers = [
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/dashboard",
      element: (
        <PrivateRoute>
          <DashboardPage />
        </PrivateRoute>
      ),
    },
    {
      path: "/profile",
      element: (
        <PrivateRoute>
          <ProfilePage />
        </PrivateRoute>
      ),
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
      element: (
        <PrivateRoute>
          <ResumeUploaderPage />
        </PrivateRoute>
      ),
    },
    {
      path: "/verify-email",
      element: <VerifyEmailPage />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPasswordPage />,
    },
    {
      path: "/analysis/:id",
      element: (
        <PrivateRoute>
          <AnalysisResultsPage />
        </PrivateRoute>
      ),
    },
    {
      path: "/about",
      element: <AboutPage />,
    },
    {
      path: "/my-reviews",
      element: <ResumePage />,
    },
    {
      path: "/faq",
      element: <FaqPage />,
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
