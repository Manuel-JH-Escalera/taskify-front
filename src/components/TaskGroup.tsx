import { Paper, Stack, Typography, useTheme } from "@mui/material";
import { useDroppable } from "@dnd-kit/core";
import DraggableTask from "./DraggableTask";
import type { TaskGroupProps } from "../types/common";

function TaskGroup({
  id,
  taskGroupTitle,
  tasks,
  handleModalTaskOpen,
  handleModalDeleteOpen,
}: TaskGroupProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      square={false}
      sx={{
        bgcolor: isOver
          ? theme.palette.taskGroup.dragOver
          : theme.palette.taskGroup.background,
        padding: 1,
        height: "100%",
        transition: "background-color 0.2s ease",
      }}
      ref={setNodeRef}
    >
      <Stack spacing={{ xs: 2, md: 3 }} sx={{ minHeight: "200px" }}>
        <Typography variant="h5">{taskGroupTitle}</Typography>
        {tasks?.length > 0 &&
          tasks.map((task) => (
            <DraggableTask
              key={task.id}
              task={task}
              handleModalTaskOpen={handleModalTaskOpen}
              handleModalDeleteOpen={handleModalDeleteOpen}
            />
          ))}
      </Stack>
    </Paper>
  );
}

export default TaskGroup;
