import { useState, useEffect } from "react";
import { TextField, Stack, Button, Box } from "@mui/material";
import { TaskFormProps } from "../types/common";

export default function TaskForm({ task, onSubmit, onCancel }: TaskFormProps) {
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
  }>({
    name: "",
    description: "",
  });

  // Cargar los datos de la tarea cuando cambia la tarea seleccionada
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
      onSubmit({
        ...task,
        name: formData.name,
        description: formData.description,
      });
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
          <Button type="submit" variant="contained" color="success">
            {task ? "Update" : "Create"}
          </Button>
        </Box>
      </Stack>
    </form>
  );
}
