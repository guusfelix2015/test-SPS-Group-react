import { useNavigate } from 'react-router-dom';
import { AuthActionType, useAuth } from '../store/auth';
import { removeAccessToken } from '../utils/auth';

export const Header = () => {

  const navigate = useNavigate();
  const { dispatch } = useAuth();

  const handleLogout = () => {
    removeAccessToken();
    dispatch({ type: AuthActionType.LOGOUT });
    navigate("/signin");
  };

  return (
    <header className="w-full bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">
          Teste Desenvolvedor Fullstack Gustavo Felix - Patrocínio - MG
        </h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 
          transition duration-200"
        >
          Sair
        </button>
      </div>
    </header>
  );
};
