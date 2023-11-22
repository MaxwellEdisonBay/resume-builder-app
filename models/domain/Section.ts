import { BaseSectionContent } from "./SectionContent";

export interface BaseSection {
  title: string;
  type: SectionTypes;
  id: string;
  content: BaseSectionContent[];
}

export type SectionTypes = "work" | "education" | "skills" | "projects";
