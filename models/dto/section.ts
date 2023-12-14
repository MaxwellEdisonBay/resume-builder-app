import { Bullet, Content } from "@models/domain/Content";
import { Section } from "@models/domain/Section";
import { Schema, model, models } from "mongoose";

const BulletSchema = new Schema<Bullet>({
  text: {
    type: String,
    // required: [true, "Bullet text is required!"],
  }
})

const SectionContentSchema = new Schema<Content>(
  {
    title: {
      type: String,
      required: [true, "Section title is required!"],
    },
    bullets: {
      type: [BulletSchema],
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
    workType: {
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

const SectionSchema = new Schema<Section>(
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

const Section = models.Section || model<Section>("Section", SectionSchema);

export default Section;
