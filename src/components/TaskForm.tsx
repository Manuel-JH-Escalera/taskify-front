import { useState, useEffect } from "react";
import { TextField, Stack, Button, Box } from "@mui/material";
import { TaskFormProps } from "../types/common";
import useCreateTask from "../hooks/useCreateTask";
import { useQueryClient } from "@tanstack/react-query";
import useUpdateTask from "../hooks/useUpdateTask";
import { enqueueSnackbar } from "notistack";

export default function TaskForm({ task, onCancel }: TaskFormProps) {
  const queryClient = useQueryClient();
  const { mutate: mutateCreateTask, isPending: isPendingCreateTask } =
    useCreateTask();
  const { mutate: mutateUpdateTask, isPending: isPendingUpdateTask } =
    useUpdateTask();

  const [formData, setFormData] = useState<{
    name: string;
    description: string;
  }>({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (task) {
      setFormData({
        name: task.name,
        description: task.description,
      });
    }
  }, [task]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task) {
      mutateUpdateTask(
        { ...formData, id: task?.id },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            enqueueSnackbar("Task updated successfully", {
              variant: "success",
            });
            onCancel();
          },
          onError: () => {
            enqueueSnackbar("Error updating task", { variant: "error" });
          },
        }
      );
    } else {
      mutateCreateTask(
        { ...formData, status: "TO_DO" },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            enqueueSnackbar("Task created successfully", {
              variant: "success",
            });
            onCancel();
          },
          onError: () => {
            enqueueSnackbar("Error creating task", { variant: "error" });
          },
        }
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={{ xs: 2, md: 3 }}>
        <TextField
          label="Task name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          multiline
          rows={4}
          fullWidth
          required
        />
        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="success"
            disabled={isPendingCreateTask || isPendingUpdateTask}
          >
            {task ? "Update" : "Create"}
          </Button>
        </Box>
      </Stack>
    </form>
  );
}
