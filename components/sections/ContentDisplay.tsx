import { Badge } from "@components/ui/badge";
import { Card, CardContent } from "@components/ui/card";
import { Content } from "@models/domain/Content";
import { SectionTypes } from "@models/domain/Section";
import { getRndColorFromString } from "@utils/formHelpers";
import { shortDegreeLevels, workTypesNames } from "@utils/textUtils";
import { Github, Link as LinkIcon } from "lucide-react";
import moment from "moment";
import Link from "next/link";
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
    skills: <SkillsContentDisplay content={content} />,
    projects: <ProjectsContentDisplay content={content} />,
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
              {/* {content?.educationGpa ? "|" : ""} */}
              {content?.educationGpa && (
                <Badge>{`GPA: ${content.educationGpa}`}</Badge>
              )}

              {/* <h3 className="font-bold">
                {content?.educationGpa ? "GPA: " + content.educationGpa : ""}
              </h3> */}
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

const SkillsContentDisplay = ({ content }: BaseContentDisplayProps) => {
  return (
    <Card className="mb-3 w-full" key={content?._id}>
      <CardContent className="p-5 w-full flex flex-col gap-3">
        <h1 className="font-bold">{content?.title}</h1>
        <div className="flex flex-row flex-wrap gap-1">
          {content?.bullets?.map((b) => {
            return (
              <Badge
                key={b._id}
                style={{ background: getRndColorFromString(content.title) }}
              >
                {b.text}
              </Badge>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

const ProjectsContentDisplay = ({ content }: BaseContentDisplayProps) => {
  const start =
    content?.startDate && moment(content.startDate).format("MMM YYYY");
  const end =
    content?.startDate &&
    (content?.endDate
      ? moment(content?.endDate).format("MMM YYYY")
      : "Present");
  return (
    <Card className="mb-3 w-full" key={content?._id}>
      <CardContent className="p-5 w-full">
        <div className="flex flex-row justify-between w-full flex-wrap">
          <div className="flex flex-row gap-3 flex-wrap">
            <h2 className="font-medium">{`${content?.title}`}</h2>
            <div className="flex flex-row items-center gap-1">
              {content?.githubUrl && (
                <>
                  <Link href={content.githubUrl} passHref={true}>
                    <Badge variant="outline">
                      <div className="flex flex-row items-center">
                        <Github className="w-4 h-4 mr-2" />
                        <p>GitHub</p>
                      </div>
                    </Badge>
                  </Link>
                </>
              )}
              {content?.websiteUrl && (
                <>
                  <Link href={content.websiteUrl} passHref={true}>
                    <Badge variant="outline">
                      <div className="flex flex-row items-center ">
                        <LinkIcon className="w-4 h-4 mr-2" />
                        <p>Website</p>
                      </div>
                    </Badge>
                  </Link>
                </>
              )}
            </div>
          </div>
          {start && end && (
            <p className="text-slate-500 italic">{`${start} - ${end}`}</p>
          )}
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

export default ContentDisplay;
