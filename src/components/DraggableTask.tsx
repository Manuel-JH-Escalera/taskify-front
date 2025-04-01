import { Card, CardContent, Stack, Typography, Divider } from "@mui/material";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { CSSProperties } from "react";
import type { Task } from "../types/common";

interface DraggableTaskProps {
  task: Task;
}

function DraggableTask({ task }: DraggableTaskProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
    });

  const style: CSSProperties | undefined = transform
    ? {
        transform: CSS.Translate.toString(transform),
        zIndex: 999,
        opacity: isDragging ? 0 : 1, // Oculta el elemento original cuando se arrastra
        cursor: isDragging ? "grab" : "pointer",
      }
    : undefined;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      sx={{
        cursor: isDragging ? "grab" : "pointer",
        opacity: isDragging ? 0 : 1, // Redundante pero por si el style inline no funciona
        visibility: isDragging ? "hidden" : "visible", // Alternativa que asegura que no ocupe espacio
        touchAction: "none",
      }}
    >
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="body1">{task.name}</Typography>
          <Divider />
          <Typography variant="body2">{task.description}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default DraggableTask;
