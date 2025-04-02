import { UniqueIdentifier } from "@dnd-kit/core";
import { ReactNode } from "react";
import { Breakpoint } from "@mui/material/styles";

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
  handleModalTaskOpen: (task: Task) => void;
  handleModalDeleteOpen: (task: Task) => void;
}

interface DraggableTaskProps {
  task: Task;
  handleModalTaskOpen: (task: Task) => void;
  handleModalDeleteOpen: (task: Task) => void;
}

interface ModalTaskProps {
  title: ReactNode;
  body: ReactNode;
  footer?: ReactNode;
  handleClose: () => void;
  open: boolean;
  size: Breakpoint;
}

interface TaskFormProps {
  task?: Task | null;
  onSubmit: (updatedTask: Task) => void;
  onCancel: () => void;
}

export type {
  Task,
  ContainerId,
  TaskGroupProps,
  DraggableTaskProps,
  ModalTaskProps,
  TaskFormProps,
};
