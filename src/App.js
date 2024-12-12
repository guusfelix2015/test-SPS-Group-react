import React, { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { useAxiosInterceptors } from "./hooks/useAxiosInterceptors";
import { AuthActionType, useAuth } from "./store/auth";
import { isAuthenticated as checkIsAuthenticated } from "./utils/auth";
import { Toaster } from "react-hot-toast";
import userService from "./services/UserService";
function App() {
  useAxiosInterceptors();
  const [isLoaded, setIsLoaded] = useState(false);
  const { isAuthenticated, dispatch } = useAuth();

  const fetchUser = async () => {
    try {
      const user = await userService.getMe();
      dispatch({ type: AuthActionType.LOGIN, payload: user });
      setIsLoaded(true);
    } catch (error) {
      setIsLoaded(true);
      console.error("Erro ao buscar usuário:", error);
    }
  };

  useEffect(() => {
    const hasAccessToken = checkIsAuthenticated();
    if (!hasAccessToken) {
      setIsLoaded(true);
      return;
    }
    dispatch({ type: AuthActionType.LOGIN });
    setIsLoaded(true);
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchUser();
  }, [isAuthenticated]);

  if (!isLoaded) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
