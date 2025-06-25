import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/authcontext";
import Routers from "./router/router";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routers />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
