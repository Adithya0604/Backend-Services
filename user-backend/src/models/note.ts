import mongoose, { Schema, Document } from "mongoose";

export interface INote extends Document {
  title: string;
  description: string;
  status: "active" | "archived" | "deleted";
  userId: mongoose.Types.ObjectId;
}

const NoteSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["active", "archived", "deleted"],
      default: "active",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Note = mongoose.model<INote>("Note", NoteSchema);
