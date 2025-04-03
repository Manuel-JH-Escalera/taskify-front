import { useMemo } from "react";
import {
  Typography,
  Stack,
  Paper,
  Grid,
  Box,
  useTheme,
  Card,
  CardContent,
  CardHeader,
  Divider,
} from "@mui/material";
import useTasks from "../hooks/useTasks";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface Task {
  _id: string;
  name: string;
  description: string;
  status: "TO_DO" | "TODO" | "IN_PROGRESS" | "COMPLETED";
  id: string;
  created_at: string;
  updated_at: string | null;
}

interface TasksResponse {
  data: Task[];
  length: number;
}

interface StatusCount {
  status: string;
  count: number;
  color: string;
}

function Statistics() {
  const { data: tasks = { data: [], length: 0 } } = useTasks() as {
    data: TasksResponse;
  };
  const theme = useTheme();

  const statusCounts = useMemo<StatusCount[]>(() => {
    if (!tasks?.data || tasks.data.length === 0) {
      return [];
    }

    const counts: Record<string, number> = {
      TO_DO: 0,
      IN_PROGRESS: 0,
      COMPLETED: 0,
    };

    tasks.data.forEach((task) => {
      if (counts[task.status] !== undefined) {
        counts[task.status] += 1;
      } else {
        counts[task.status] = 1;
      }
    });

    const data = Object.entries(counts).map(([status, count]) => ({
      status: status === "TODO" ? "TO_DO" : status,
      count,
      color:
        status === "COMPLETED"
          ? theme.palette.success.main
          : status === "IN_PROGRESS"
          ? theme.palette.warning.main
          : theme.palette.info.main,
    }));

    return data.filter((item) => item.count > 0);
  }, [tasks, theme.palette]);

  const COLORS = statusCounts.map((item) => item.color);

  const totalTasks = tasks?.data?.length || 0;

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
    index: number;
  }) => {
    if (isNaN(percent) || percent === undefined) {
      return null;
    }

    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
    const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const calculatePercentage = (count: number): number => {
    if (totalTasks === 0) return 0;
    return Math.round((count / totalTasks) * 100);
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h3">Task Statistics</Typography>
      <Divider />
      {!tasks?.data?.length ? (
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="body1">
            No tasks available. Add some tasks to see statistics.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {/* Tarjeta de resumen */}
          <Grid size={{ xs: 12, md: 4 }} sx={{ mt: 0 }}>
            <Card>
              <CardHeader title="Task Summary" />
              <Divider />
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="body1">
                    Total Tasks: <strong>{totalTasks}</strong>
                  </Typography>
                  {statusCounts.map((item) => (
                    <Box
                      key={item.status}
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <Box
                          component="span"
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            bgcolor: item.color,
                            mr: 1,
                            display: "inline-block",
                          }}
                        />
                        {item.status.replace("_", " ")}:
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {item.count} ({calculatePercentage(item.count)}%)
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Gráfico circular */}
          <Grid size={{ xs: 12, md: 4 }} sx={{ mt: 0 }}>
            <Card>
              <CardHeader title="Tasks by Status (Pie Chart)" />
              <Divider />
              <CardContent>
                <Box
                  sx={{
                    height: 300,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusCounts}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {statusCounts.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name, props) => [
                          `${value} tasks (${calculatePercentage(
                            Number(value)
                          )}%)`,
                          props.payload.status.replace("_", " "),
                        ]}
                      />
                      <Legend
                        formatter={(value, entry) =>
                          entry.payload.status.replace("_", " ")
                        }
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Gráfico de barras */}
          <Grid size={{ xs: 12, md: 4 }} sx={{ mt: 0 }}>
            <Card>
              <CardHeader title="Tasks by Status (Bar Chart)" />
              <Divider />
              <CardContent>
                <Box
                  sx={{
                    height: 300,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={statusCounts}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="status"
                        tickFormatter={(value) => value.replace("_", " ")}
                      />
                      <YAxis allowDecimals={false} />
                      <Tooltip
                        formatter={(value, name, props) => [
                          `${value} tasks (${calculatePercentage(
                            Number(value)
                          )}%)`,
                          props.payload.status.replace("_", " "),
                        ]}
                      />
                      <Bar
                        dataKey="count"
                        name="Task Count"
                        radius={[4, 4, 0, 0]}
                      >
                        {statusCounts.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Stack>
  );
}

export default Statistics;
