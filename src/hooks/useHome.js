import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import userService from "../services/UserService";
import toast from "react-hot-toast";
import { useAuth } from "../store/auth";

export function useHome() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const { user } = useAuth();

  const userName = user?.data?.name;
  const isAdmin = user?.data?.type === "admin";

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await userService.list();
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (userId) => userService.delete(userId),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      toast.success("Usuário deletado com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao deletar usuário: " + error.message);
    },
  });

  const filteredUsers = users ? users.filter(u => {
    if (isAdmin) return true; 
    return u.id === user?.data?.id;
  }) : [];

  const canDeleteUser = (userId) => {
    if (isAdmin && userId !== user?.data?.id) {
      return true;
    }
    return false;
  };

  const canEditUser = (userId) => {
    if (isAdmin) return true;
    return userId === user?.data?.id;
  };

  const handleDeleteUser = (userId) => {
    deleteMutation.mutate(userId);
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    editingUser,
    setEditingUser,
    userName,
    isLoading,
    filteredUsers,
    handleDeleteUser,
    canDeleteUser,
    canEditUser,
    isAdmin
  };
} 