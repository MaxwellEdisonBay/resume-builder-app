import { Card, CardContent } from "@components/ui/card";
import { Separator } from "@components/ui/separator";
import { EducationDegreeLevel } from "@models/api/ContentRs";
import { Content, workTypesNames } from "@models/domain/Content";
import { SectionTypes } from "@models/domain/Section";
import moment from "moment";
import React from "react";

interface BaseContentDisplayProps {
  content?: Content;
}

export interface ContentDisplayProps extends BaseContentDisplayProps {
  sectionType: SectionTypes;
}

const ContentDisplay = ({ content, sectionType }: ContentDisplayProps) => {
  const contentDisplays: Record<SectionTypes, React.ReactNode> = {
    work: <WorkContentDisplay content={content} />,
    education: <EducationContentDisplay content={content} />,
    skills: <div className="">Skills Display</div>,
    projects: <div className="">Projects Display</div>,
  };

  return contentDisplays[sectionType];
};

const WorkContentDisplay = ({ content }: BaseContentDisplayProps) => {
  const start = moment(content?.startDate).format("MMM YYYY");
  const end = content?.endDate
    ? moment(content?.endDate).format("MMM YYYY")
    : "Present";
  return (
    <Card className="mb-3 w-full" key={content?._id}>
      <CardContent className="p-5 w-full">
        <div className="flex flex-row justify-between w-full">
          <div className="flex flex-col">
            <h2 className="font-medium">{`${content?.position} @ ${content?.title}`}</h2>
            <h3 className="text-slate-500">{`${content?.location} | ${
              content?.workType ? workTypesNames[content.workType] : ""
            }`}</h3>
          </div>
          <p className="text-slate-500 italic">{`${start} - ${end}`}</p>
        </div>

        <ul className="list-disc px-5 pt-3">
          {content?.bullets?.map((bullet) => (
            <li key={bullet._id} className="hyphens-auto break-words">
              {bullet.text}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

const EducationContentDisplay = ({ content }: BaseContentDisplayProps) => {
  const start = moment(content?.startDate).format("MMM YYYY");
  const end = content?.endDate
    ? moment(content?.endDate).format("MMM YYYY")
    : "Present";
  const shortDegreeLevels: Record<EducationDegreeLevel, string> = {
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
  const shordDegreeLevel =
    content?.educationDegreeLevel &&
    shortDegreeLevels[content.educationDegreeLevel];
  return (
    <Card className="mb-3 w-full" key={content?._id}>
      <CardContent className="p-5 w-full">
        <div className="flex flex-row justify-between w-full">
          <div className="flex flex-col">
            <h2 className="font-medium">{`${content?.title}`}</h2>
            <div className="text-slate-500 flex flex-row items-center gap-2">
            <h3 className="">{`${shordDegreeLevel} in ${content?.educationMajorName}`}</h3>
            {content?.educationGpa ? "|" : ""}
            <h3 className="font-bold">{content?.educationGpa ? "GPA: " + content.educationGpa : ""}</h3>
            </div>
          </div>
          <div className="flex flex-col">
            <p className="">{content?.location}</p>
            <p className="text-slate-500 italic">{`${start} - ${end}`}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentDisplay;
