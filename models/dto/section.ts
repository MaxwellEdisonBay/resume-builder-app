import { BaseSection } from "@models/domain/Section";
import { BaseSectionContent } from "@models/domain/SectionContent";
import { Schema, model, models } from "mongoose";

const SectionContentSchema = new Schema<BaseSectionContent>(
  {
    title: {
      type: String,
      required: [true, "Section title is required!"],
    },
    bullets: {
      type: [String],
    },
    position: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    type: {
      type: String,
      enum: ["full-time", "hybrid", "part-time", "remote"],
      default: "full-time",
    },
    location: {
      type: String,
    },
  },
  { timestamps: true }
);

const SectionSchema = new Schema<BaseSection>(
  {
    title: {
      type: String,
      // required: [true, "Section title is required!"],
    },
    userId: {
      type: String,
      required: [true, "Section userId is required!"],
    },
    type: {
      type: String,
      enum: ["work", "education", "skills", "projects"],
      default: "work",
    },
    content: [SectionContentSchema],
  },
  { timestamps: true }
);

const Section = models.Section || model<BaseSection>("Section", SectionSchema);

export default Section;
