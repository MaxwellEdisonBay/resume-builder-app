import { DatePicker } from "@components/DatePicker";
import Selector, { SelectorItem } from "@components/Selector";
import { Card, CardContent } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Draggable } from "@hello-pangea/dnd";
import { SectionTypes } from "@models/domain/Section";
import {
  BaseSectionContent,
  ContentTypes,
} from "@models/domain/SectionContent";
import React, { useState } from "react";
import { DateRange } from "react-day-picker";
import DraggableBullets from "./DraggableBullets";

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

export const getTypeText = (type?: ContentTypes) => {
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

interface WorkSelectorData extends SelectorItem {
  key: ContentTypes;
}

export const WorkExperienceContent = ({ content, onChange }: ContentProps) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
  };
  const startDateFormatted =
    content?.startDate?.toLocaleString("en-US", options) || "";
  const endDateFormatted =
    content?.endDate?.toLocaleString("en-US", options) || "";

  const [startDate, setStartDate] = useState<Date | undefined>();
  const [dates, setDates] = useState<Date[] | undefined>();
  const [range, setRange] = useState<DateRange | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [value, setValue] = useState<ContentTypes | undefined>();

  const selectorData: WorkSelectorData[] = [
    {
      key: "full-time",
      text: "Full-time",
    },
    {
      key: "hybrid",
      text: "Hybrid",
    },
    {
      key: "part-time",
      text: "Part-time",
    },
    {
      key: "remote",
      text: "Remote",
    },
  ];
  return (
    <Card>
      <CardContent>
        <form>
          <div className="flex sm:flex-row flex-col sm:justify-between py-5 sm:gap-2">
            <div className="flex flex-col justify-betweeen gap-2">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="company">Company</Label>
                <Input id="company" placeholder="Amazon, Google, etc" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="company">Position</Label>
                <Input id="company" placeholder="eg. Software Engineer" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col space-y-1.5 pt-2 sm:pt-0">
                <Label htmlFor="start-end-dates">Start / End Date</Label>
                <div
                  className="flex flex-col sm:flex-row gap-2 sm:items-center"
                  id="start-end-dates"
                >
                  <DatePicker
                    date={startDate}
                    setDate={setStartDate}
                    text="Start Date"
                  />
                  <DatePicker
                    date={endDate}
                    setDate={setEndDate}
                    text="End Date"
                  />
                </div>
              </div>
              <div className="flex flex-col  sm:flex-row justify-start gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" placeholder="eg. Ontario, Canada" />
                </div>
                <div className="flex">
                  <Selector
                    onValueChange={(val: string) =>
                      setValue(val as ContentTypes)
                    }
                    label="Work Type"
                    placeholder="eg. Remote"
                    value={value}
                    items={selectorData}
                  />
                </div>
              </div>
            </div>
          </div>
          <DraggableBullets/>
        </form>
      </CardContent>
    </Card>
  );
};
