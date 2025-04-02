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

function Home() {
  const [todos, setTodos] = useState<Task[]>([
    {
      id: 1,
      name: "Task 1",
      description: "lorem",
    },
    {
      id: 2,
      name: "Task 2",
      description:
        "Lorem ipsum dolor sit amet consectetur adipiscing elit class, hendrerit turpis nisi sed gravida duis litora pellentesque, nisl quisque iaculis potenti ligula ante fermentum. Inceptos taciti rhoncus condimentum rutrum imperdiet quisque tortor malesuada, natoque euismod nam ad cursus hac vehicula montes odio, bibendum dui justo curae phasellus ornare a. Orci odio dapibus duis ut varius pretium congue, netus quisque pulvinar justo conubia tincidunt sed, natoque est accumsan sollicitudin cursus dis.",
    },
    {
      id: 3,
      name: "Task 3",
      description:
        "Lorem ipsum dolor sit amet consectetur adipiscing elit class.",
    },
  ]);
  const [inProgress, setInProgress] = useState<Task[]>([]);
  const [finished, setFinished] = useState<Task[]>([]);

  const [activeId, setActiveId] = useState<number | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [modalNewTask, setModalNewTask] = useState(false);
  const [modalTaskOpen, setModalTaskOpen] = useState(false);
  const [modalTaskDelete, setModalTaskDelete] = useState(false);

  useEffect(() => {
    console.log("selected task", selectedTask);
  }, [selectedTask]);

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

  // Función para encontrar la tarea en cualquier lista
  const findTask = (id: number): Task | undefined => {
    const allTasks = [...todos, ...inProgress, ...finished];
    return allTasks.find((task) => task.id === id);
  };

  // Función para encontrar el contenedor de un elemento
  const findContainer = (id: number): ContainerId | undefined => {
    if (todos.find((task) => task.id === id)) return "todos";
    if (inProgress.find((task) => task.id === id)) return "inProgress";
    if (finished.find((task) => task.id === id)) return "finished";
    return undefined;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as number);
    setActiveTask(findTask(active.id as number) || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      setActiveTask(null);
      return;
    }

    const sourceContainer = findContainer(active.id as number);
    const destinationContainer = over.id as ContainerId;

    // Si no se movió a un contenedor diferente
    if (sourceContainer === destinationContainer) {
      setActiveId(null);
      setActiveTask(null);
      return;
    }

    // Encontrar el elemento a mover
    const task = findTask(active.id as number);

    if (!task) {
      setActiveId(null);
      setActiveTask(null);
      return;
    }

    // Remover de la lista original
    if (sourceContainer === "todos") {
      setTodos(todos.filter((t) => t.id !== active.id));
    } else if (sourceContainer === "inProgress") {
      setInProgress(inProgress.filter((t) => t.id !== active.id));
    } else if (sourceContainer === "finished") {
      setFinished(finished.filter((t) => t.id !== active.id));
    }

    // Añadir a la nueva lista
    if (destinationContainer === "todos") {
      setTodos([...todos, task]);
    } else if (destinationContainer === "inProgress") {
      setInProgress([...inProgress, task]);
    } else if (destinationContainer === "finished") {
      setFinished([...finished, task]);
    }

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

  // Nueva función para manejar la actualización de tareas
  const handleUpdateTask = (updatedTask: Task) => {
    const container = findContainer(updatedTask.id);

    if (container === "todos") {
      setTodos(
        todos.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
    } else if (container === "inProgress") {
      setInProgress(
        inProgress.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        )
      );
    } else if (container === "finished") {
      setFinished(
        finished.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        )
      );
    }

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
    console.log("task");
  };

  return (
    <Stack spacing={{ xs: 2, md: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h3">Task Board</Typography>
        <Button
          type="submit"
          variant="contained"
          color="success"
          onClick={() => handleModalCreateOpen()}
          size="medium"
          endIcon={<AddIcon />}
        >
          New task
        </Button>
      </Box>
      <Divider />
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
              tasks={todos}
              handleModalTaskOpen={handleModalTaskOpen}
              handleModalDeleteOpen={handleModalDeleteOpen}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }} sx={{ mt: { xs: 2, md: 0 } }}>
            <TaskGroup
              id="inProgress"
              taskGroupTitle={"IN PROGRESS"}
              tasks={inProgress}
              handleModalTaskOpen={handleModalTaskOpen}
              handleModalDeleteOpen={handleModalDeleteOpen}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }} sx={{ mt: { xs: 2, md: 0 } }}>
            <TaskGroup
              id="finished"
              taskGroupTitle={"FINISHED"}
              tasks={finished}
              handleModalTaskOpen={handleModalTaskOpen}
              handleModalDeleteOpen={handleModalDeleteOpen}
            />
          </Grid>
        </Grid>

        {/* Overlay para mostrar el elemento que se está arrastrando */}
        <DragOverlay>
          {activeId && activeTask ? (
            <Card sx={{ touchAction: "none" }}>
              <CardContent>
                <Stack spacing={1}>
                  <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
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

      {/* Create task modal */}
      <Modal
        open={modalNewTask}
        handleClose={handleModalCreateClose}
        title={`Create new task`}
        size="md"
        body={
          <TaskForm
            onSubmit={handleCreateTask}
            onCancel={handleModalCreateClose}
          />
        }
      />

      {/* Update task modal */}
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

      {/* Delete task modal */}
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
              <Button type="submit" variant="contained" color="error">
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
