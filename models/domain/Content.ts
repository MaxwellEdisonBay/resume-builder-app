import { ContentRs } from "@models/api/ContentRs";

export type WorkTypes = "full-time" | "hybrid" | "part-time" | "remote";

export interface Content extends Omit<ContentRs, "startDate" | "endDate">  {
  startDate?: Date;
  endDate?: Date;
}

export interface Bullet {
  _id: string;
  text: string;
}

export const workTypesNames: Record<WorkTypes, string> = {
  "full-time": "Full-time",
  hybrid: "Hybrid",
  "part-time": "Part-time",
  remote: "Remote",
};