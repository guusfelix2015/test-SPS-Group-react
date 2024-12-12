import { createBrowserRouter } from "react-router-dom";
import { RequireAuth, RequireNotAuth } from "./guards/AuthGuards";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";

const router = createBrowserRouter([
  {
    path: "/signin",
    element: (
      <RequireNotAuth>
        <SignIn />
      </RequireNotAuth>
    ),
  },
  {
    path: "/",
    element: (
      <RequireAuth>
        <Home />
      </RequireAuth>
    ),
  },
]);

export default router;
