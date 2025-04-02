import { useState, useEffect } from "react";
import { Task } from "../types/common";

const useOrganizedTasks = (tasks: Task[] | undefined) => {
  const [todoTasks, setTodoTasks] = useState<Task[]>([]);
  const [inProgressTasks, setInProgressTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
      setTodoTasks([]);
      setInProgressTasks([]);
      setCompletedTasks([]);
      return;
    }

    const sortByCreationDate = (a: Task, b: Task) => {
      return (
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    };

    const filteredTodoTasks = tasks
      .filter((task) => task.status === "TO_DO" || task.status === "TODO")
      .sort(sortByCreationDate);

    const filteredInProgressTasks = tasks
      .filter((task) => task.status === "IN_PROGRESS")
      .sort(sortByCreationDate);

    const filteredCompletedTasks = tasks
      .filter((task) => task.status === "COMPLETED")
      .sort(sortByCreationDate);

    setTodoTasks(filteredTodoTasks);
    setInProgressTasks(filteredInProgressTasks);
    setCompletedTasks(filteredCompletedTasks);
  }, [tasks]);

  return [todoTasks, inProgressTasks, completedTasks, setTodoTasks] as const;
};

export default useOrganizedTasks;
