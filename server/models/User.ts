import mongoose, { Document, Schema, model } from "mongoose";

// Interface untuk tipe User
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  profileImgUrl?: string | null;
  role: "admin" | "member";
  createdAt: Date;
  updatedAt: Date;
}

// Schema mongoose
const UserSchema: Schema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImgUrl: { type: String, default: null },
    role: { type: String, enum: ["admin", "member"], default: "member" },
  },
  {
    timestamps: true,
  }
);

// Export model
const User = model<IUser>("User", UserSchema);
export default User;
