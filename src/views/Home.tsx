import {
  Stack,
  Divider,
  Typography,
  Grid,
  Box,
  IconButton,
  Alert,
  AlertTitle,
  Button,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import TaskGroup from "../components/TaskGroup";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { Card, CardContent } from "@mui/material";
import type { Task, ContainerId } from "../types/common";
import Modal from "../components/Modal";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TaskForm from "../components/TaskForm";
import AddIcon from "@mui/icons-material/Add";
import useTasks from "../hooks/useTasks";
import { useQueryClient } from "@tanstack/react-query";
import useUpdateTask from "../hooks/useUpdateTask";
import useDeleteTask from "../hooks/useDeleteTask";
import { enqueueSnackbar } from "notistack";

function Home() {
  const queryClient = useQueryClient();
  const { data: tasks, isLoading: isLoadingTasks } = useTasks();
  const { mutate: mutateUpdateTask } = useUpdateTask();
  const { mutate: mutateDeleteTask, isPending: isPendingDeleteTask } =
    useDeleteTask();
  const [todoTasks, setTodoTasks] = useState<Task[]>([]);
  const [inProgressTasks, setInProgressTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [modalNewTask, setModalNewTask] = useState(false);
  const [modalTaskOpen, setModalTaskOpen] = useState(false);
  const [modalTaskDelete, setModalTaskDelete] = useState(false);

  useEffect(() => {
    if (!tasks?.data || !Array.isArray(tasks.data)) return;

    const sortByCreationDate = (a: Task, b: Task) => {
      return (
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    };

    setTodoTasks(
      tasks.data
        .filter(
          (task: Task) => task.status === "TO_DO" || task.status === "TODO"
        )
        .sort(sortByCreationDate)
    );

    setInProgressTasks(
      tasks.data
        .filter((task: Task) => task.status === "IN_PROGRESS")
        .sort(sortByCreationDate)
    );

    setCompletedTasks(
      tasks.data
        .filter((task: Task) => task.status === "COMPLETED")
        .sort(sortByCreationDate)
    );
  }, [tasks]);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      distance: 10,
      delay: 250,
    },
  });

  const keyboardSensor = useSensor(KeyboardSensor);
  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  const findTask = (id: string): Task | undefined => {
    const allTasks = [...todoTasks, ...inProgressTasks, ...completedTasks];
    return allTasks.find((task) => task.id === id);
  };

  const findContainer = (id: string): ContainerId | undefined => {
    if (todoTasks.find((task) => task.id === id)) return "todos";
    if (inProgressTasks.find((task) => task.id === id)) return "inProgress";
    if (completedTasks.find((task) => task.id === id)) return "finished";
    return undefined;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    setActiveTask(findTask(active.id as string) || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      setActiveTask(null);
      return;
    }

    const sourceContainer = findContainer(active.id as string);
    const destinationContainer = over.id as ContainerId;

    if (sourceContainer === destinationContainer) {
      setActiveId(null);
      setActiveTask(null);
      return;
    }

    const task = findTask(active.id as string);

    if (!task) {
      setActiveId(null);
      setActiveTask(null);
      return;
    }

    const statusMap: Record<
      ContainerId,
      "TO_DO" | "IN_PROGRESS" | "COMPLETED"
    > = {
      todos: "TO_DO",
      inProgress: "IN_PROGRESS",
      finished: "COMPLETED",
    };

    const updatedTask = {
      ...task,
      status: statusMap[destinationContainer],
    };

    let newTodoTasks = [...todoTasks];
    let newInProgressTasks = [...inProgressTasks];
    let newCompletedTasks = [...completedTasks];

    if (sourceContainer === "todos") {
      newTodoTasks = newTodoTasks.filter((t) => t.id !== task.id);
    } else if (sourceContainer === "inProgress") {
      newInProgressTasks = newInProgressTasks.filter((t) => t.id !== task.id);
    } else if (sourceContainer === "finished") {
      newCompletedTasks = newCompletedTasks.filter((t) => t.id !== task.id);
    }

    if (destinationContainer === "todos") {
      newTodoTasks.push(updatedTask);
    } else if (destinationContainer === "inProgress") {
      newInProgressTasks.push(updatedTask);
    } else if (destinationContainer === "finished") {
      newCompletedTasks.push(updatedTask);
    }

    setTodoTasks(newTodoTasks);
    setInProgressTasks(newInProgressTasks);
    setCompletedTasks(newCompletedTasks);

    mutateUpdateTask(updatedTask, {
      onError: (error) => {
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
        console.error("Error updating task status:", error);
      },
    });

    setActiveId(null);
    setActiveTask(null);
  };

  const handleModalTaskOpen = (task: Task) => {
    setModalTaskOpen(true);
    setSelectedTask(task);
  };

  const handleModalTaskClose = () => {
    setModalTaskOpen(false);
    setSelectedTask(null);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    const container = findContainer(updatedTask.id);

    if (container === "todos") {
      setTodoTasks(
        todoTasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        )
      );
    } else if (container === "inProgress") {
      setInProgressTasks(
        inProgressTasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        )
      );
    } else if (container === "finished") {
      setCompletedTasks(
        completedTasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        )
      );
    }

    mutateUpdateTask(updatedTask, {
      onError: (error) => {
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
        console.error("Error updating task:", error);
      },
    });

    handleModalTaskClose();
  };

  const handleModalDeleteOpen = (task: Task) => {
    setModalTaskDelete(true);
    setSelectedTask(task);
  };

  const handleModalDeleteClose = () => {
    setModalTaskDelete(false);
    setSelectedTask(null);
  };

  const handleModalCreateOpen = () => {
    setModalNewTask(true);
  };

  const handleModalCreateClose = () => {
    setModalNewTask(false);
  };

  const handleCreateTask = () => {
    handleModalCreateClose();
  };

  const handleDeleteTask = () => {
    if (!selectedTask) return;

    mutateDeleteTask(selectedTask.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
        enqueueSnackbar("Task deleted successfully", {
          variant: "success",
        });
        setModalTaskDelete(false);
      },
      onError: (error) => {
        enqueueSnackbar("Error deleting task", { variant: "error" });
        console.error(error);
      },
    });
  };

  return (
    <Stack spacing={{ xs: 2, md: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h3">Task Board</Typography>
        <Button
          type="submit"
          variant="contained"
          color="success"
          onClick={handleModalCreateOpen}
          size="medium"
          endIcon={<AddIcon />}
        >
          New task
        </Button>
      </Box>
      <Divider />
      {isLoadingTasks ? (
        <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
          <Typography variant="h6" margin={1}>
            Loading tasks...
          </Typography>
          <CircularProgress />
        </Box>
      ) : (
        <DndContext
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          sensors={sensors}
        >
          <Grid container spacing={{ xs: 2, md: 3 }} pb={3}>
            <Grid size={{ xs: 12, md: 4 }} sx={{ mt: 0 }}>
              <TaskGroup
                id="todos"
                taskGroupTitle={"TO DO"}
                tasks={todoTasks}
                handleModalTaskOpen={handleModalTaskOpen}
                handleModalDeleteOpen={handleModalDeleteOpen}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }} sx={{ mt: 0 }}>
              <TaskGroup
                id="inProgress"
                taskGroupTitle={"IN PROGRESS"}
                tasks={inProgressTasks}
                handleModalTaskOpen={handleModalTaskOpen}
                handleModalDeleteOpen={handleModalDeleteOpen}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }} sx={{ mt: 0 }}>
              <TaskGroup
                id="finished"
                taskGroupTitle={"COMPLETED"}
                tasks={completedTasks}
                handleModalTaskOpen={handleModalTaskOpen}
                handleModalDeleteOpen={handleModalDeleteOpen}
              />
            </Grid>
          </Grid>
          <DragOverlay>
            {activeId && activeTask ? (
              <Card sx={{ touchAction: "none" }}>
                <CardContent>
                  <Stack spacing={1}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="h6">{activeTask.name}</Typography>
                      <Box>
                        <IconButton>
                          <EditIcon />
                        </IconButton>
                        <IconButton>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                    <Divider />
                    <Typography variant="body1">Description</Typography>
                    <Typography variant="body2">
                      {activeTask.description}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
      <Modal
        open={modalNewTask}
        handleClose={handleModalCreateClose}
        title="Create new task"
        size="md"
        body={
          <TaskForm
            onSubmit={handleCreateTask}
            onCancel={handleModalCreateClose}
          />
        }
      />
      <Modal
        open={modalTaskOpen}
        handleClose={handleModalTaskClose}
        title={`Update: ${selectedTask?.name}`}
        size="md"
        body={
          <TaskForm
            task={selectedTask}
            onSubmit={handleUpdateTask}
            onCancel={handleModalTaskClose}
          />
        }
      />
      <Modal
        open={modalTaskDelete}
        handleClose={handleModalDeleteClose}
        title={`Delete: ${selectedTask?.name}`}
        size="md"
        body={
          <Stack spacing={{ xs: 2, md: 3 }}>
            <Alert severity="warning">
              <AlertTitle>Warning</AlertTitle>
              Are you sure you want to delete this task? This action cannot be
              undone.
            </Alert>
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button variant="outlined" onClick={handleModalDeleteClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="error"
                onClick={handleDeleteTask}
                disabled={isPendingDeleteTask}
                loading={isPendingDeleteTask}
              >
                Delete
              </Button>
            </Box>
          </Stack>
        }
      />
    </Stack>
  );
}
export default Home;
