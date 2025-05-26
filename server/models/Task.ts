import mongoose, { Document, Schema } from "mongoose";

// Todo subdocument interface
interface Todo {
  text: string;
  completed?: boolean;
}

// Main Task interface
export interface ITask extends Document {
  title: string;
  description?: string;
  priority: "Low" | "Medium" | "High";
  status: "Pending" | "In Progress" | "Completed";
  dueDate: Date;
  assignedTo: mongoose.Types.ObjectId[];
  createBy: mongoose.Types.ObjectId;
  attachments?: string[];
  todoChecklist?: Todo[];
  progress?: number;
}

// Subschema for checklist
const todoSchema = new Schema<Todo>({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

// Main task schema
const taskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
    dueDate: { type: Date, required: true },
    assignedTo: [{ type: Schema.Types.ObjectId, ref: "User" }],
    createBy: { type: Schema.Types.ObjectId, ref: "User" },
    attachments: [{ type: String }], // typo fixed here
    todoChecklist: [todoSchema],
    progress: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const TaskModel = mongoose.model<ITask>("Task", taskSchema);
export default TaskModel;
