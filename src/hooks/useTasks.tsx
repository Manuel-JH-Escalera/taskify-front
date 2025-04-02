import { useQuery } from "@tanstack/react-query";

function useTasks() {
  const fetchTasks = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACK_URL}dev/tasks`);
      if (!response.ok) throw new Error("Error fetching todos");
      const data = await response.json();
      return data;
    } catch (err) {
      console.error(err.message);
    }
  };
  return useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });
}

export default useTasks;
