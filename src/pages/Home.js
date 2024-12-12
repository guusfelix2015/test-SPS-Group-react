import React from "react";
import { Header } from "../components/Header";
import { useHome } from "../hooks/useHome";
import { UserCreateDialog } from "../components/UserCreateDialog";
import { EditUserDialog } from "../components/EditUserDialog";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
function Home() {
  const {
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
  } = useHome();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 flex items-center justify-between border mb-8">
          <h2 className="text-2xl font-semibold">Bem-vindo, {userName}</h2>
          <button
            onClick={() => setIsDialogOpen(true)}
            className="text-yellow-500 hover:text-yellow-600 font-medium"
          >
            Adicionar Usuário
          </button>
        </div>

        {isLoading ? (
          <div className="text-center">Carregando...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center text-gray-500">
            Nenhum usuário cadastrado ainda.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-lg shadow p-6 border relative"
              >
                <div className="absolute top-4 right-4 flex gap-2">
                  {canDeleteUser(user.id) && (
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  )}
                  {canEditUser(user.id) && (
                    <button
                      onClick={() => setEditingUser(user)}
                      className="text-yellow-500 hover:text-yellow-600"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
                <div className="mb-2">
                  <h3 className="text-lg font-semibold">{user.name}</h3>
                  <p className="text-gray-600">{user.email}</p>
                </div>
                <span
                  className={`inline-block rounded-full px-3 py-1 text-sm ${
                    user.type === "admin"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {user.type}
                </span>
              </div>
            ))}
          </div>
        )}

        <UserCreateDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
        />

        <EditUserDialog
          isOpen={!!editingUser}
          onClose={() => setEditingUser(null)}
          user={editingUser}
        />
      </main>
    </div>
  );
}

export default Home;
