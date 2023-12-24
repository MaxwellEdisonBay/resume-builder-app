import { SectionTypes } from "@models/domain/Section";
import { z } from "zod";

export const getSectionSchema = (sectionType: SectionTypes) => {
  switch (sectionType) {
    case "work":
      return WorkFormSchema;
    case "education":
      return EducationFormSchema;
    case "projects":
      return ProjectsFormSchema;
    case "skills":
      return SkillsFormSchema;
  }
};

export type SectionSchemas = ReturnType<typeof getSectionSchema>;

const SectionTitleSchema = z
  .string()
  .trim()
  .min(2, {
    message: "Section title must be at least 2 characters.",
  })
  .max(40, { message: "Section title must be less than 40 characters" });

const BulletSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, {
      message: "Bullet cannot be empty.",
    })
    .max(250, { message: "Bullet must be less than 250 characters" }),
  _id: z.string(),
});

export const WorkFormSchema = z.object({
  title: SectionTitleSchema,
  content: z.array(
    z
      .object({
        _id: z.string(),
        title: z
          .string()
          .trim()
          .min(2, {
            message: "Content title must be at least 2 characters.",
          })
          .max(40, {
            message: "Content title must be less than 40 characters",
          }),
        position: z
          .string()
          .trim()
          .min(2, {
            message: "Content title must be at least 2 characters.",
          })
          .max(40, {
            message: "Content title must be less than 40 characters",
          }),
        startDate: z.date({ required_error: "Start date is required." }),
        endDate: z.date().optional(),
        isEndPresent: z.boolean().optional(),
        bullets: z.array(BulletSchema),
        location: z
          .string({ required_error: "Location is required." })
          .trim()
          .min(2, {
            message: "Location must be at least 2 characters.",
          })
          .max(40, { message: "Location must be less than 40 characters" }),
        workType: z.string({ required_error: "Work type is required." }).trim(),
      })
      .refine(
        (data) =>
          data.isEndPresent || (data.endDate && data.endDate > data.startDate),
        {
          message: "End date cannot be earlier than start date.",
          path: ["endDate"],
        }
      )
  ),
});

export const EducationFormSchema = z.object({
  title: SectionTitleSchema,
  content: z.array(
    z
      .object({
        _id: z.string(),
        educationGpa: z
          .string()
          .trim()
          .max(10, { message: "Grade should not be more than 10 characters" })
          .optional(),
        educationDegreeLevel: z
          .string({
            required_error: "Degree level is required!",
          })
          .trim(),
        educationMajorName: z
          .string({
            required_error: "Major name is required!",
          })
          .trim()
          .min(2, {
            message: "Field of study must be at least 2 characters.",
          })
          .max(40, {
            message: "Field of study must be less than 40 characters",
          }),
        startDate: z.date({ required_error: "Start date is required." }),
        endDate: z.date().optional(),
        isEndPresent: z.boolean().optional(),
        location: z
          .string({ required_error: "Location is required." })
          .trim()
          .min(2, {
            message: "Location must be at least 2 characters.",
          })
          .max(40, { message: "Location must be less than 40 characters" }),

        title: z
          .string()
          .trim()
          .min(2, {
            message: "School name must be at least 2 characters.",
          })
          .max(40, {
            message: "School name must be less than 40 characters",
          }),
      })
      .refine(
        (data) =>
          data.isEndPresent || (data.endDate && data.endDate > data.startDate),
        {
          message: "End date cannot be earlier than start date.",
          path: ["endDate"],
        }
      )
  ),
});

export const ProjectsFormSchema = z.object({
  title: SectionTitleSchema,
  content: z.array(
    z
      .object({
        _id: z.string(),
        title: z
          .string()
          .trim()
          .min(2, {
            message: "Content title must be at least 2 characters.",
          })
          .max(40, {
            message: "Content title must be less than 40 characters",
          }),
          githubUrl: z
          .string()
          .url()
          .trim()
          .max(150, {
            message: "Github URL must be less than 150 characters",
          }).optional(),
          websiteUrl: z
          .string()
          .url()
          .trim()
          .max(150, {
            message: "Website URL must be less than 150 characters",
          }).optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        isEndPresent: z.boolean().optional(),
        bullets: z.array(BulletSchema),
      })
      .refine(
        (data) =>
          data.isEndPresent || (data.endDate && data.startDate && data.endDate > data.startDate) || (!data.endDate && !data.startDate),
        {
          message: "End date cannot be earlier than start date.",
          path: ["endDate"],
        }
      )
  ),
});

export const SkillsFormSchema = z.object({
  title: SectionTitleSchema,
  content: z.array(
    z.object({
      _id: z.string(),
      bullets: z.array(BulletSchema),
      skillInput: z.string().trim().optional(),
      title: z
        .string()
        .trim()
        .min(2, {
          message: "Skills group title must be at least 2 characters.",
        })
        .max(40, {
          message: "Skills group title must be less than 40 characters",
        }),
    })
  ),
});
