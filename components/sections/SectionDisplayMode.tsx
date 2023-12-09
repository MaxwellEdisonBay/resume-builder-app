import { Card, CardContent } from "@components/ui/card";
import { BaseSection } from "@models/domain/Section";
import moment from "moment";
import React from "react";
import { getTypeText } from "./WorkExperienceSection";

export interface SectionDisplayModeProps {
  section: BaseSection;
  isReorderMode: boolean;
}

const SectionDisplayMode = ({
  section,
  isReorderMode,
}: SectionDisplayModeProps) => {
  return (
    <div className="flex flex-col p-5">
      {section.content.map((content) => {
        const start = moment(content.startDate).format("MMM YYYY");
        const end = moment(content.endDate).format("MMM YYYY");

        return (
          <Card className="mb-3" key={content._id}>
            <CardContent className="p-5">
              <div className="flex flex-row justify-between">
                <div className="flex flex-col">
                  <h2 className="font-medium">{`${content.position} @ ${content.title}`}</h2>
                  <h3 className="text-slate-500">{`${
                    content.location
                  } | ${getTypeText(content?.type)}`}</h3>
                </div>
                <p className="text-slate-500 italic">{`${start} - ${end}`}</p>
              </div>
              {!isReorderMode && (
                <ul className="list-disc px-5 pt-3">
                  {content.bullets?.map((bullet) => (
                    <li className="">{bullet}</li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default SectionDisplayMode;
