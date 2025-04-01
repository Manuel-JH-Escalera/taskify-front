import { Paper, Stack, Typography } from "@mui/material";
import { useDroppable } from "@dnd-kit/core";
import DraggableTask from "./DraggableTask";

function TaskGroup({ id, taskGroupTitle, tasks }) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <Paper
      elevation={0}
      square={false}
      sx={{
        bgcolor: isOver ? "#e6f7ff" : "#f7f8f9",
        padding: 1,
        height: "100%",
        transition: "background-color 0.2s ease",
      }}
      ref={setNodeRef}
    >
      <Typography variant="h6">{taskGroupTitle}</Typography>

      <Stack spacing={{ xs: 2, md: 3 }} sx={{ minHeight: "200px" }}>
        {tasks.length > 0 &&
          tasks.map((task) => <DraggableTask key={task.id} task={task} />)}
      </Stack>
    </Paper>
  );
}

export default TaskGroup;
