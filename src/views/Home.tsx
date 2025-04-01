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
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { Card, CardContent } from "@mui/material";
import type { Task, ContainerId } from "../types/common";

function Home() {
  const [todos, setTodos] = useState<Task[]>([
    {
      id: 1,
      name: "task 1",
      description: "lorem",
    },
    {
      id: 2,
      name: "task 2",
      description: "lorem",
    },
  ]);
  const [inProgress, setInProgress] = useState<Task[]>([]);
  const [finished, setFinished] = useState<Task[]>([]);

  const [activeId, setActiveId] = useState<number | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

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
