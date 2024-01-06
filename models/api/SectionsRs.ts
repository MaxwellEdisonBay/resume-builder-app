import { Section, SectionTypes } from "@models/domain/Section";
import { ContentRs, mapContentRsToContent } from "./ContentRs";

export interface SectionRs {
  _id: string;
  title?: string;
  type: SectionTypes;
  userId: string;
  resumeId: string,
  newAdded?: boolean;
  content?: ContentRs[];
  createdAt?: string;
  updatedAt?: string;
}

export const mapSectionRsToContent = (rs: SectionRs) => {
  const section: Section = {
    ...rs,
    content: rs.content?.map((c) => mapContentRsToContent(c)),
    createdAt: rs.createdAt ? new Date(rs.createdAt) : undefined,
    updatedAt: rs.updatedAt ? new Date(rs.updatedAt) : undefined,
  };
  return section;
};
