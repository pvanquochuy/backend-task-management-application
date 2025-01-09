import mongoose, { Schema, Document, Types } from "mongoose";

export enum TaskStatus {
  PENDING = "Pending",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
}

export interface ITask extends Document {
  title: string;
  description?: string;
  status: TaskStatus;
  assignedTo?: Types.ObjectId[];
  createdBy: Types.ObjectId;
  dueDate?: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: TaskStatus, default: TaskStatus.PENDING },
    assignedTo: [{ type: Schema.Types.ObjectId, ref: "User" }],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    dueDate: { type: Date },
  },
  {
    timestamps: true,
  }
);

export const Task = mongoose.model<ITask>("Task", taskSchema);
