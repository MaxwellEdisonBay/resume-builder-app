import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Draggable } from "@hello-pangea/dnd";
import { SectionTypes } from "@models/domain/Section";
import {
  BaseSectionContent,
  ContentTypes,
} from "@models/domain/SectionContent";
import React, { useState } from "react";

export interface SectionContentProps {
  type: SectionTypes;
  index: number;
  content: BaseSectionContent;
  onChange: React.Dispatch<React.SetStateAction<BaseSectionContent>>;
}

interface ContentProps {
  content: BaseSectionContent;
  onChange: React.Dispatch<React.SetStateAction<BaseSectionContent>>;
}

export const SectionContent = ({
  type,
  index,
  content,
  onChange,
}: SectionContentProps) => {
  const getContentLayout = () => {
    switch (type) {
      case "work":
        return <WorkExperienceContent content={content} onChange={onChange} />;
    }
  };
  return (
    <Draggable draggableId={content.id} index={index}>
      {(providedContent) => (
        <div
          className=" flex flex-row items-stretch mb-2 w-full select-none"
          ref={providedContent.innerRef}
          {...providedContent.draggableProps}
        >
          <div
            className={`flex flex-row justify-center p-5`}
            {...providedContent.dragHandleProps}
          >
            <div className="flex bg-slate-300  w-1 rounded-lg "></div>
          </div>
          <div className="flex flex-col py-5 pr-5  flex-1">
            {getContentLayout()}
          </div>
        </div>
      )}
    </Draggable>
  );
};

const getTypeText = (type?: ContentTypes) => {
  switch (type) {
    case "remote":
      return "Remote";
    case "full-time":
      return "Full-time";
    case "hybrid":
      return "Hybrid";
    case "part-time":
      return "Part-time";
    default:
      return "";
  }
};

export const WorkExperienceContent = ({ content, onChange }: ContentProps) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
  };
  const startDateFormatted =
    content?.startDate?.toLocaleString("en-US", options) || "";
  const endDateFormatted =
    content?.endDate?.toLocaleString("en-US", options) || "";
  return (
    <Card>
      <CardContent>
        <form>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Name of your project" />
          </div>
          <div className="flex flex-row justify-between">
            <p>{content.title}</p>
            <p>{content.location || "Location"}</p>
          </div>

          <div className="flex flex-row justify-between">
            <p>{content.position}</p>
            <p>{`${startDateFormatted} - ${endDateFormatted}, ${getTypeText(
              content.type
            )}`}</p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
