import mongoose, { Schema, Document } from "mongoose";

export interface IAudit extends Document {
  action: string;
  entityType: "user" | "note";
  entityId: mongoose.Types.ObjectId;
  adminId: mongoose.Types.ObjectId;
  details: Record<string, any>;
}

const AuditSchema: Schema = new Schema(
  {
    action: { type: String, required: true },
    entityType: {
      type: String,
      enum: ["user", "note"],
      required: true,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    details: {
      type: Map,
      of: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export const Audit = mongoose.model<IAudit>("Audit", AuditSchema);
