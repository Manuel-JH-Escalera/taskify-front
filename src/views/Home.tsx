import { Stack, Divider, Typography, Grid } from "@mui/material";
import { useState } from "react";
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
} from "@dnd-kit/core";
import { Card, CardContent } from "@mui/material";

function Home() {
  const [todos, setTodos] = useState([
    {
      id: "task-1",
      name: "task 1",
      description: "lorem",
    },
    {
      id: "task-2",
      name: "task 2",
      description: "lorem",
    },
  ]);
  const [inProgress, setInProgress] = useState([]);
  const [finished, setFinished] = useState([]);

  const [activeId, setActiveId] = useState(null);
  const [activeTask, setActiveTask] = useState(null);

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
  const findTask = (id) => {
    const allTasks = [...todos, ...inProgress, ...finished];
    return allTasks.find((task) => task.id === id);
  };

  // Función para encontrar el contenedor de un elemento
  const findContainer = (id) => {
    if (todos.find((task) => task.id === id)) return "todos";
    if (inProgress.find((task) => task.id === id)) return "inProgress";
    if (finished.find((task) => task.id === id)) return "finished";
    return null;
  };

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
    setActiveTask(findTask(active.id));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      setActiveTask(null);
      return;
    }

    const sourceContainer = findContainer(active.id);
    const destinationContainer = over.id;

    // Si no se movió a un contenedor diferente
    if (sourceContainer === destinationContainer) {
      setActiveId(null);
      setActiveTask(null);
      return;
    }

    // Encontrar el elemento a mover
    const task = findTask(active.id);

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

  return (
    <Stack spacing={{ xs: 2, md: 3 }}>
      <Typography variant="h4">Tablero de tareas</Typography>
      <Divider />
      <DndContext
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <Grid container spacing={{ xs: 2, md: 3 }}>
          <Grid size={{ xs: 12, md: 4 }} mt={3}>
            <TaskGroup id="todos" taskGroupTitle={"TO DO"} tasks={todos} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }} mt={3}>
            <TaskGroup
              id="inProgress"
              taskGroupTitle={"IN PROGRESS"}
              tasks={inProgress}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }} mt={3}>
            <TaskGroup
              id="finished"
              taskGroupTitle={"FINISHED"}
              tasks={finished}
            />
          </Grid>
        </Grid>

        {/* Overlay para mostrar el elemento que se está arrastrando */}
        <DragOverlay>
          {activeId && activeTask ? (
            <Card sx={{ touchAction: "none" }}>
              <CardContent>
                <Stack spacing={1}>
                  <Typography variant="body1">{activeTask.name}</Typography>
                  <Divider />
                  <Typography variant="body2">
                    {activeTask.description}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>
    </Stack>
  );
}

export default Home;
