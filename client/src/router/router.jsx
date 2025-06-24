import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";

const Router = () => {
  const routers = [
    {
      path: "/",
      element: <h1>Home Page</h1>,
    },
    {
      path: "/about",
      element: <h1>About Page</h1>,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
  ];
  return (
    <BrowserRouter>
      <Routes>
        {routers.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
