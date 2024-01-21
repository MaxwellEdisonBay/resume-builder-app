import { IResume } from "@models/domain/IResume";
import { TemplateServer } from "@models/domain/Template";
import { Schema, model, models } from "mongoose";

const TemplateSchema = new Schema<TemplateServer>(
  {
    title: {
      type: [String],
      // required: [true, "Section title is required!"],
    },
    thubmnail: {
        type: String,
    },
  },
  { timestamps: true }
);

const Template = models.Template || model<TemplateServer>("Template", TemplateSchema);

export default Template;
