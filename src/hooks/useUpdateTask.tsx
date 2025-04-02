import { useMutation } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

function useUpdateTask() {
  const auth = useAuth();
  const updateTask = async (taskData) => {
    const response = await fetch(
      `${import.meta.env.VITE_BACK_URL}dev/tasks/${taskData.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.user?.id_token}`,
        },
        body: JSON.stringify(taskData),
      }
    );

    if (!response.ok) {
      throw new Error("Error update task");
    }

    return response.json();
  };

  return useMutation({
    mutationFn: updateTask,
  });
}

export default useUpdateTask;
