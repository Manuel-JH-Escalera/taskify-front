import { useMutation } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

function useCreateTask() {
  const auth = useAuth();
  const createTask = async (taskData) => {
    const response = await fetch(`${import.meta.env.VITE_BACK_URL}dev/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.user?.id_token}`,
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      throw new Error("Error create task");
    }

    return response.json();
  };

  return useMutation({
    mutationFn: createTask,
  });
}

export default useCreateTask;
