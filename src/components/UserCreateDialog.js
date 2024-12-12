import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from 'react-hot-toast';
import userService from "../services/UserService";

const createUserSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(4, "A senha deve ter no mínimo 4 caracteres"),
  name: z.string().min(3, "O nome deve ter no mínimo 3 caracteres"),
});

export function UserCreateDialog({ isOpen, onClose }) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(createUserSchema),
  });

  const createMutation = useMutation({
    mutationFn: (data) => userService.create({ ...data, type: "user" }),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      toast.success('Usuário criado com sucesso!');
      reset();
      onClose();
    },
    onError: (error) => {
      toast.error('Erro ao criar usuário: ' + error.message);
    }
  });

  const onSubmit = (data) => {
    createMutation.mutate(data);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 mb-4"
                >
                  Adicionar Novo Usuário
                </Dialog.Title>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome
                    </label>
                    <input
                      type="text"
                      {...register("name")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md 
                        focus:outline-none focus:ring-2 focus:ring-yellow-500 
                        focus:border-transparent bg-gray-50"
                      placeholder="Digite o nome do usuário"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      {...register("email")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md 
                        focus:outline-none focus:ring-2 focus:ring-yellow-500 
                        focus:border-transparent bg-gray-50"
                      placeholder="Digite o email do usuário"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Senha
                    </label>
                    <input
                      type="password"
                      {...register("password")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md 
                        focus:outline-none focus:ring-2 focus:ring-yellow-500 
                        focus:border-transparent bg-gray-50"
                      placeholder="Digite a senha do usuário"
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo
                    </label>
                    <input
                      type="text"
                      value="user"
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md 
                        focus:outline-none focus:ring-2 focus:ring-yellow-500 
                        focus:border-transparent bg-gray-50"
                    />
                  </div>

                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
                      onClick={onClose}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-yellow-500 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-600"
                      disabled={createMutation.isLoading}
                    >
                      {createMutation.isLoading
                        ? "Criando..."
                        : "Criar Usuário"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
