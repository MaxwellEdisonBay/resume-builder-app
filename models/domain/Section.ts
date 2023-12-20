import { Content } from "./Content";

export type SectionTypes = "work" | "education" | "skills" | "projects";

export interface Section {
  _id: string;
  title?: string;
  type: SectionTypes;
  userId: string;
  newAdded?: boolean;
  content?: Content[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BaseDeleteById {
  id: string;
}
