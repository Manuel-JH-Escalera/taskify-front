import { UniqueIdentifier } from "@dnd-kit/core";

interface Task {
  id: number;
  name: string;
  description: string;
}

type ContainerId = "todos" | "inProgress" | "finished";

interface TaskGroupProps {
  id: UniqueIdentifier;
  taskGroupTitle: string;
  tasks: Task[];
}

export type { Task, ContainerId, TaskGroupProps };
