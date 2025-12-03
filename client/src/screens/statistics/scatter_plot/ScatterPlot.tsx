import { Alert, Col, Form, Row, Spinner } from "react-bootstrap";
import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useState } from "react";

import LimitSelector from "../../../components/LimitSelector";
import { Pagination } from "../../../types/pagination";
import TablePagination from "../../../components/Pagination";
import { Task } from "../../../types/TaskModel";

type AxisOption = "likes" | "shares" | "reach" | "comments" | "sales";

interface TaskWithSales extends Task {
  total_sales_attributed: number | null;
}

interface ScatterDataPoint {
  x: number;
  y: number;
}

const getTasks = async (
  page: number,
  limit: number,
): Promise<{ data: TaskWithSales[]; pagination: Pagination }> => {
  const response = await fetch(
    `http://localhost:5000/tasks?page=${page}&limit=${limit}`,
  );
  const result = await response.json();
  return result;
};

const ScatterPlot = () => {
  const [tasks, setTasks] = useState<TaskWithSales[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(1000);
  const [xAxis, setXAxis] = useState<AxisOption>("likes");
  const [yAxis, setYAxis] = useState<AxisOption>("sales");

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const result = await getTasks(currentPage, currentLimit);
        setTasks(result.data);
        setPagination(result.pagination);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [currentPage, currentLimit]);

  // Transform tasks into scatter plot data
  const getScatterData = (): ScatterDataPoint[] => {
    return tasks
      .filter((task) => {
        const xValue = getValue(task, xAxis);
        const yValue = getValue(task, yAxis);
        return xValue !== null && yValue !== null;
      })
      .map((task) => ({
        x: getValue(task, xAxis) as number,
        y: getValue(task, yAxis) as number,
      }));
  };

  const getValue = (task: TaskWithSales, axis: AxisOption): number | null => {
    switch (axis) {
      case "likes":
        return task.likes;
      case "shares":
        return task.shares;
      case "reach":
        return task.reach;
      case "comments":
        return task.comments;
      case "sales":
        return task.total_sales_attributed;
      default:
        return null;
    }
  };

  const getAxisLabel = (axis: AxisOption): string => {
    switch (axis) {
      case "likes":
        return "Likes";
      case "shares":
        return "Shares";
      case "reach":
        return "Reach";
      case "comments":
        return "Comments";
      case "sales":
        return "Total Sales Attributed";
      default:
        return "";
    }
  };

  if (error) {
    return <Alert variant={"danger"}>{error.message}</Alert>;
  }

  if (loading) {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }

  const scatterData = getScatterData();

  return (
    <>
      <Row className="mb-4">
        <Col md={6}>
          <Form.Group>
            <Form.Label>X Axis</Form.Label>
            <Form.Select
              value={xAxis}
              onChange={(e) => setXAxis(e.target.value as AxisOption)}
            >
              <option value="likes">Likes</option>
              <option value="shares">Shares</option>
              <option value="reach">Reach</option>
              <option value="comments">Comments</option>
              <option value="sales">Sales</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Y Axis</Form.Label>
            <Form.Select
              value={yAxis}
              onChange={(e) => setYAxis(e.target.value as AxisOption)}
            >
              <option value="likes">Likes</option>
              <option value="shares">Shares</option>
              <option value="reach">Reach</option>
              <option value="comments">Comments</option>
              <option value="sales">Sales</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <ResponsiveContainer width="100%" height={500}>
        <ScatterChart
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid />
          <XAxis
            type="number"
            dataKey="x"
            name={getAxisLabel(xAxis)}
            label={{
              value: getAxisLabel(xAxis),
              position: "insideBottom",
              offset: -5,
            }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name={getAxisLabel(yAxis)}
            label={{
              value: getAxisLabel(yAxis),
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Scatter name="Tasks" data={scatterData} fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>

      <div className="d-flex justify-content-between align-items-center mt-3">
        {pagination && (
          <TablePagination
            pagination={pagination}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        )}
        <LimitSelector
          currentLimit={currentLimit}
          setCurrentLimit={setCurrentLimit}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </>
  );
};

export default ScatterPlot;
