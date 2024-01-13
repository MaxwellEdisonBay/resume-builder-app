import { File } from "@models/domain/File";
import { Schema, model, models } from "mongoose";

const FileSchema = new Schema<File>(
  {
    userId: {
      type: String,
      required: [true, "User ID is required!"],
    },
    resumeId: {
      type: String,
    },
    file: {
      type: Buffer,
      required: [true, "File data is required!"],
    },
    name: {
      type: String,
      required: [true, "File name is required!"],
    },
    contentType: {
      type: String,
      required: [true, "File content type is required!"],
    },
    size: {
      type: Number,
      required: [true, "File size is required!"],
    },
  },
  { timestamps: true }
);

const File = models.File || model<File>("File", FileSchema);

export default File;
