import { Content } from "./Content";

export type SectionTypes = "work" | "education" | "skills" | "projects";

export interface Section {
  _id: string;
  title?: string;
  type: SectionTypes;
  userId: string,
  newAdded?: boolean;
  content?: Content[];
  createdAt?: Date;
  updatedAt?: Date;
}
// import { BaseSectionContent } from "./SectionContent";

// export interface BaseSection {
//   _id?: string;
//   title: string;
//   type: SectionTypes;
//   userId: string;
//   createdAt?: Date;
//   updatedAt?: Date;
//   editing?: boolean;
//   content: BaseSectionContent[];
// }

// export type SectionTypes = "work" | "education" | "skills" | "projects";

export interface BaseDeleteById {
  id: string;
}
