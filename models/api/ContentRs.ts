import { Bullet, Content, WorkTypes } from "@models/domain/Content";

export interface ContentRs {
  _id: string;
  title: string;
  workType?: WorkTypes;
  position?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  bullets?: Bullet[];
}

export const mapContentRsToContent = (rs: ContentRs) => {
  const content: Content = {
    ...rs,
    startDate: rs.startDate ? new Date(rs.startDate) : undefined,
    endDate: rs.endDate ? new Date(rs.endDate) : undefined,
  };
  return content;
};
