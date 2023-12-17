import { Card, CardContent } from "@components/ui/card";
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
    education: <div className="">Education Display</div>,
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
            <li key={bullet._id} className="hyphens-auto break-words">{bullet.text}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default ContentDisplay;
