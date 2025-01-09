import express from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getTaskStatistics,
  updateTaskStatus,
  //   assignMembersToTask,
} from "../controllers/task.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();

// Các route cho task, yêu cầu phải có xác thực
router.post("/tasks", authenticate, createTask); // Tạo công việc mới
router.get("/tasks", authenticate, getTasks); // Lấy danh sách công việc
router.put("/tasks/:id", authenticate, updateTask); // Cập nhật công việc
router.delete("/tasks/:id", authenticate, deleteTask); // Xóa công việc
router.get("/tasks/statistics", authenticate, getTaskStatistics); // Thống kê công việc
router.patch("/tasks/:id/status", authenticate, updateTaskStatus); // Cập nhật trạng thái công việc
// router.patch("/tasks/:taskId/assign", authenticate, assignMembersToTask);

export default router;
