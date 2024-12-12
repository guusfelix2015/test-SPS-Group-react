import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { saveAccessToken, setAccessTokenToApiClient } from '../utils/auth';
import { AuthActionType, useAuth } from '../store/auth';
import userService from '../services/UserService';
import toast from 'react-hot-toast';
const signInSchema = z.object({
  email: z.string()
    .email('Email inválido')
    .min(1, 'Email é obrigatório'),
  password: z.string()
    .min(3, 'Senha deve ter no mínimo 3 caracteres')
    .min(1, 'Senha é obrigatória'),
});



function SignIn() {
  const navigate = useNavigate();
  const { dispatch } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signInSchema),
  });

  const mutation = useMutation({
    mutationFn: userService.loginUser,
    onSuccess: (data) => {
      const { token } = data.data;
      saveAccessToken({ token });
      setAccessTokenToApiClient(token);
      dispatch({ type: AuthActionType.LOGIN });
      navigate('/');
      toast.success('Login realizado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro no login:', error);
      toast.error('Erro no login: ' + error.message);
    }
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">
            Acessar minha conta
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Endereço de e-mail
            </label>
            <input
              {...register('email')}
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md 
                focus:outline-none focus:ring-2 focus:ring-yellow-500 
                focus:border-transparent bg-gray-50"
              placeholder="Digite seu e-mail"
            />
            {errors.email && (
              <span className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </span>
            )}
          </div>

          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Senha
            </label>
            <input
              placeholder="Digite sua senha"
              {...register('password')}
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md 
                focus:outline-none focus:ring-2 focus:ring-yellow-500 
                focus:border-transparent bg-gray-50"
            />
            {errors.password && (
              <span className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md 
              hover:bg-yellow-600 transition duration-200 font-medium
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mutation.isPending ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
