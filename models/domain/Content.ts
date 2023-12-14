export type WorkTypes = "full-time" | "hybrid" | "part-time" | "remote";

export interface Content {
  _id: string;
  title: string;
  workType?: WorkTypes;
  position?: string;
  startDate?: Date;
  endDate?: Date;
  location?: string;
  bullets?: Bullet[];
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