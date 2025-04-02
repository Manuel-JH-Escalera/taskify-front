import { useMutation } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

function useDeleteTask() {
  const auth = useAuth();
  const deleteTask = async (taskId: string) => {
    const response = await fetch(
      `${import.meta.env.VITE_BACK_URL}dev/tasks/${taskId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.user?.id_token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error delete task");
    }

    return response.json();
  };

  return useMutation({
    mutationFn: deleteTask,
  });
}

export default useDeleteTask;
