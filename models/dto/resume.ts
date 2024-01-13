import { Resume } from "@models/domain/Resume";
import { Schema, model, models } from "mongoose";

const ResumeSchema = new Schema<Resume>(
  {
    sections: {
      type: [String],
      // required: [true, "Section title is required!"],
    },
    name: {
        type: String,
        required: [true, "Resume name is required!"],
    },
    userId: {
      type: String,
      required: [true, "Section userId is required!"],
    },
    pdfOutputBinary: {
      type: String,
    },
    sampleId: {
      type: String,
    },
    downloads: {
      pdf: {
        type: String
      }
    }
  },
  { timestamps: true }
);

const Resume = models.Resume || model<Resume>("Resume", ResumeSchema);

export default Resume;
