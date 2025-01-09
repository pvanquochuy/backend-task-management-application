import { Request, Response, NextFunction } from "express";
import { Task, TaskStatus } from "../models/task.model";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

// Tạo công việc mới
export const createTask = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, description, assignedTo, dueDate } = req.body;

    const task = new Task({
      title,
      description,
      assignedTo,
      createdBy: req.user?.id,
      dueDate,
    });

    await task.save();
    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    next(error);
  }
};

// Lấy danh sách công việc
export const getTasks = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status } = req.query;
    const query: any = {
      $or: [{ createdBy: req.user?.id }, { assignedTo: req.user?.id }],
    };

    if (status) {
      query["status"] = status;
    }

    const tasks = await Task.find(query).populate("assignedTo createdBy");
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// Cập nhật công việc
export const updateTask = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: id, createdBy: req.user?.id },
      updates,
      { new: true }
    );

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.json({ message: "Task updated successfully", task });
    return; // Đảm bảo hàm không trả về kiểu Response
  } catch (error) {
    next(error);
  }
};

// Xóa công việc
export const deleteTask = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const task = await Task.findOneAndDelete({
      _id: id,
      createdBy: req.user?.id,
    });

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.json({ message: "Task deleted successfully" });
    return;
  } catch (error) {
    next(error);
  }
};

// Thống kê công việc
export const getTaskStatistics = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const totalTasks = await Task.countDocuments({ createdBy: req.user?.id });
    const completedTasks = await Task.countDocuments({
      createdBy: req.user?.id,
      status: TaskStatus.COMPLETED,
    });

    res.json({ totalTasks, completedTasks });
  } catch (error) {
    next(error);
  }
};

// Cập nhật trạng thái công việc
export const updateTaskStatus = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!Object.values(TaskStatus).includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const task = await Task.findOneAndUpdate(
      { _id: id, createdBy: req.user?.id },
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.json({ message: "Task status updated successfully", task });
  } catch (error) {
    next(error);
    return res
      .status(500)
      .json({ message: "Failed to update task status", error });
  }
};

// export const assignMembersToTask = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<any> => {
//   try {
//     const { taskId } = req.params;
//     const { memberIds } = req.body; // memberIds là mảng chứa các ID người dùng muốn thêm vào công việc

//     // Kiểm tra nếu memberIds là một mảng
//     if (!Array.isArray(memberIds)) {
//       return res.status(400).json({ message: "memberIds must be an array" });
//     }

//     // Tìm công việc theo ID
//     const task = await Task.findById(taskId);

//     if (!task) {
//       return res.status(404).json({ message: "Task not found" });
//     }

//     // Kiểm tra xem người dùng có phải là người tạo công việc không (hoặc có quyền để thêm thành viên)
//     if (task.createdBy.toString() !== req.user?.id) {
//       return res.status(403).json({
//         message: "You are not authorized to assign members to this task",
//       });
//     }

//     // Thêm các thành viên vào công việc
//     task.assignedTo = [...(task.assignedTo || []), ...memberIds];

//     // Lưu công việc
//     await task.save();

//     // Trả về kết quả
//     res.status(200).json({ message: "Members added successfully", task });
//   } catch (error) {
//     next(error); // Gọi next để xử lý lỗi ở middleware
//   }
// };
