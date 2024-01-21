import { EducationDegreeLevel } from "@models/api/ContentRs";
import { WorkTypes } from "@models/domain/Content";
import { SectionTypes } from "@models/domain/Section";
import { Briefcase } from "lucide-react";

export const getDefaultSectionName = (type: SectionTypes) => {
  const defaultNames: Record<SectionTypes, string> = {
    work: "Work Experience",
    education: "Education",
    skills: "Skills",
    projects: "Projects",
  };
  return defaultNames[type];
};

export const sectionTypesList: SectionTypes[] = [
  "education",
  "projects",
  "skills",
  "work",
];

export const shortDegreeLevels: Record<EducationDegreeLevel, string> = {
  aa: "AA",
  as: "AS",
  aas: "AAS",
  ba: "BA",
  bs: "BS",
  baa: "BAA",
  bas: "BAS",
  barch: "B.Arch.",
  bba: "BBA",
  bfa: "BFA",
  bsn: "BSN",
  ma: "MA",
  ms: "MS",
  mba: "MBA",
  med: "M.Ed.",
  mfa: "MFA",
  llm: "LL.M.",
  mpa: "MPA",
  mph: "MPH",
  mpp: "MPP",
  msn: "MSN",
  msw: "MSW",
  phd: "Ph.D.",
  dba: "DBA",
  edd: "Ed.D.",
  md: "MD",
  dnp: "DNP",
  pharmd: "Pharm.D.",
  psyd: "Psy.D.",
  jd: "JD",
} as const;

export interface DegreesMap {
  label: string;
  value: EducationDegreeLevel;
}

export const degrees: DegreesMap[] = [
  { label: "Associate of Arts (AA)", value: "aa" },
  { label: "Associate of Science (AS)", value: "as" },
  { label: "Associate of Applied Science (AAS)", value: "aas" },
  { label: "Bachelor of Arts (BA)", value: "ba" },
  { label: "Bachelor of Science (BS)", value: "bs" },
  { label: "Bachelor of Applied Arts (BAA)", value: "baa" },
  { label: "Bachelor of Applied Science (BAS)", value: "bas" },
  { label: "Bachelor of Architecture (B.Arch.)", value: "barch" },
  { label: "Bachelor of Business Administration (BBA)", value: "bba" },
  { label: "Bachelor of Fine Arts (BFA)", value: "bfa" },
  { label: "Bachelor of Science in Nursing (BSN)", value: "bsn" },
  { label: "Master of Arts (MA)", value: "ma" },
  { label: "Master of Science (MS)", value: "ms" },
  { label: "Master of Business Administration (MBA)", value: "mba" },
  { label: "Master of Education (M.Ed.)", value: "med" },
  { label: "Master of Fine Arts (MFA)", value: "mfa" },
  { label: "Master of Laws (LL.M.)", value: "llm" },
  { label: "Master of Public Administration (MPA)", value: "mpa" },
  { label: "Master of Public Health (MPH)", value: "mph" },
  { label: "Master of Public Policy (MPP)", value: "mpp" },
  { label: "Master of Science in Nursing (MSN)", value: "msn" },
  { label: "Master of Social Work (MSW)", value: "msw" },
  { label: "Doctor of Philosophy (Ph.D.)", value: "phd" },
  { label: "Doctor of Business Administration (DBA)", value: "dba" },
  { label: "Doctor of Education (Ed.D.)", value: "edd" },
  { label: "Doctor of Medicine (MD)", value: "md" },
  { label: "Doctor of Nursing Practice (DNP)", value: "dnp" },
  { label: "Doctor of Pharmacy (Pharm.D.)", value: "pharmd" },
  { label: "Doctor of Psychology (Psy.D.)", value: "psyd" },
  { label: "Juris Doctor (JD)", value: "jd" },
] as const;

export const workTypesNames: Record<WorkTypes, string> = {
  "full-time": "Full-time",
  hybrid: "Hybrid",
  "part-time": "Part-time",
  remote: "Remote",
};
