export interface BaseSectionContent {
  id: string;
  title: string;
  bullets?: string[];
  position?: string;
  startDate?: Date;
  endDate?: Date;
  type?: ContentTypes;
  location?: string;
}

export type ContentTypes = "full-time" | "hybrid" | "part-time" | "remote"

// export interface WorkExperienceSectionContent extends BaseSectionContent {
//   position: string;
//   startDate: Date;
//   endDate?: Date;
//   type: "full-time" | "hybrid" | "part-time" | "remote";
//   location: string;
// }
