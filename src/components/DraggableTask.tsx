import {
  Card,
  CardContent,
  Stack,
  Typography,
  Divider,
  IconButton,
  Box,
} from "@mui/material";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { CSSProperties } from "react";
import type { DraggableTaskProps } from "../types/common";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function DraggableTask({
  task,
  handleModalTaskOpen,
  handleModalDeleteOpen,
}: DraggableTaskProps) {
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
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography variant="h6">{task.name}</Typography>
            <Box>
              <IconButton>
                <EditIcon onClick={() => handleModalTaskOpen(task)} />
              </IconButton>
              <IconButton>
                <DeleteIcon onClick={() => handleModalDeleteOpen(task)} />
              </IconButton>
            </Box>
          </Box>
          <Divider />
          <Typography variant="body1">Description</Typography>
          <Typography variant="body2">{task.description}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default DraggableTask;
