import { Dialog } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import userService from "../services/UserService";
import { useEffect } from "react";

const schema = z.object({
  email: z.string().email("Email inválido"),
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  password: z.string().min(4, "Senha deve ter no mínimo 4 caracteres"),
  type: z.enum(["admin", "user"]),
});

export function EditUserDialog({ isOpen, onClose, user }) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    setValue("email", user?.email || "");
    setValue("name", user?.name || "");
    setValue("type", user?.type || "user");
    setValue("password", user?.password || "");
  }, [user]);

  const { mutate } = useMutation({
    mutationFn: (data) => userService.update(user.id, data),
    onSuccess: () => {
      toast.success("Usuário atualizado com sucesso!");
      queryClient.invalidateQueries(["users"]);
      onClose();
      reset();
    },
    onError: () => {
      toast.error("Erro ao atualizar usuário");
    },
  });

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-md">
          <Dialog.Title className="text-lg font-medium mb-4">
            Editar Usuário
          </Dialog.Title>

          <form onSubmit={handleSubmit(mutate)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nome
              </label>
              <input
                {...register("name")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md 
                        focus:outline-none focus:ring-2 focus:ring-yellow-500 
                        focus:border-transparent bg-gray-50"
                placeholder="Digite o nome do usuário"
              />
              {errors.name && (
                <span className="text-red-500 text-sm">
                  {errors.name.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                {...register("email")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md 
                        focus:outline-none focus:ring-2 focus:ring-yellow-500 
                        focus:border-transparent bg-gray-50"
                placeholder="Digite o email do usuário"
              />
              {errors.email && (
                <span className="text-red-500 text-sm">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                type="password"
                {...register("password")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md 
                        focus:outline-none focus:ring-2 focus:ring-yellow-500 
                        focus:border-transparent bg-gray-50"
              />
              {errors.password && (
                <span className="text-red-500 text-sm">
                  {errors.password.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 hidden">
                Tipo
              </label>
              <select
                disabled
                {...register("type")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md 
                        focus:outline-none focus:ring-2 focus:ring-yellow-500 
                        focus:border-transparent bg-gray-50 hidden"
              >
                <option value="user">Usuário</option>
                <option value="admin">Administrador</option>
              </select>
              {errors.type && (
                <span className="text-red-500 text-sm">
                  {errors.type.message}
                </span>
              )}
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600"
              >
                Salvar
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
