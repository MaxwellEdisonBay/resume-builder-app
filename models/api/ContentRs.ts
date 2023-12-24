import { Bullet, Content, WorkTypes } from "@models/domain/Content";

export interface ContentRs {
  _id: string;
  title: string;
  workType?: WorkTypes;
  position?: string;
  startDate?: string;
  endDate?: string;
  educationGpaMax?: number;
  educationGpa?: number;
  educationDegreeLevel?: EducationDegreeLevel;
  educationMajorName?: string;
  githubUrl?: string,
  websiteUrl?:string,
  location?: string;
  bullets?: Bullet[];
}

export type EducationDegreeLevel =
  | "aa"
  | "as"
  | "aas"
  | "ba"
  | "bs"
  | "baa"
  | "bas"
  | "barch"
  | "bba"
  | "bfa"
  | "bsn"
  | "ma"
  | "ms"
  | "mba"
  | "med"
  | "mfa"
  | "llm"
  | "mpa"
  | "mph"
  | "mpp"
  | "msn"
  | "msw"
  | "phd"
  | "dba"
  | "edd"
  | "md"
  | "dnp"
  | "pharmd"
  | "psyd"
  | "jd";

export const mapContentRsToContent = (rs: ContentRs) => {
  const content: Content = {
    ...rs,
    startDate: rs.startDate ? new Date(rs.startDate) : undefined,
    endDate: rs.endDate ? new Date(rs.endDate) : undefined,
  };
  return content;
};
