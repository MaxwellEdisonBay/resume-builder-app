import { BaseSectionContent } from "./SectionContent";

export interface BaseSection {
  _id?: string;
  title: string;
  type: SectionTypes;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
  editing?: boolean;
  content: BaseSectionContent[];
}

export type SectionTypes = "work" | "education" | "skills" | "projects";

export interface BaseDeleteById {
  id: string;
}
