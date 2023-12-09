"use client"
import { DatePicker } from "@components/DatePicker";
import Selector, { SelectorItem } from "@components/Selector";
import { Card, CardContent } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Draggable } from "@hello-pangea/dnd";
import { BaseSection, SectionTypes } from "@models/domain/Section";
import {
  BaseSectionContent,
  ContentTypes,
} from "@models/domain/SectionContent";
import React, { memo, useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import DraggableBullets from "./DraggableBullets";
import cloneDeep from "lodash.clonedeep";

export interface SectionContentProps {
  type: SectionTypes;
  index: number;
  content: BaseSectionContent;
  setSection: React.Dispatch<React.SetStateAction<BaseSection[]>>;
  onChange: (content: BaseSectionContent) => void
}

interface ContentProps {
  content: BaseSectionContent;
  setSection: React.Dispatch<React.SetStateAction<BaseSection[]>>;
  onChange: (content: BaseSectionContent) => void
}

// export const SectionContent = ( ({
  export const SectionContent = memo ( ({
  type,
  index,
  content,
  setSection,
  onChange
}: SectionContentProps) => {
  const getContentLayout = () => {
    switch (type) {
      case "work":
        return <WorkExperienceContent content={content} setSection={setSection} onChange={onChange} />;
    }
  };
  return (
    <Draggable draggableId={content._id || ""} index={index}>
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
})

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

export const WorkExperienceContent = memo (({ content, setSection, onChange }: ContentProps) => {
  // export const WorkExperienceContent =  (({ content, setSection }: ContentProps) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
  };
  useEffect(() => {
    console.log("Rerender")
  }, [])
  const startDateFormatted =
    content?.startDate?.toLocaleString("en-US", options) || "";
  const endDateFormatted =
    content?.endDate?.toLocaleString("en-US", options) || "";

  const [company, setCompany] = useState<string>(content.title)
  const [position, setPosition] = useState<string | undefined>(content.position)
  const [location, setLocation] = useState<string | undefined>(content.location)

  const [startDate, setStartDate] = useState<Date | undefined>(content.startDate);
  const [endDate, setEndDate] = useState<Date | undefined>(content.endDate);
  const [type, setType] = useState<ContentTypes | undefined>(content.type);
  
  const onCompanyChange = () => {
    const newContent = cloneDeep(content)
    newContent.title = company
    newContent.position = position
    newContent.location = location
    newContent.startDate = startDate
    newContent.endDate = endDate
    newContent.type = type
    onChange(newContent)
    // setContent((oldCont) => oldCont.map((c) => c._id === content._id ? {...content, title} : c))
    // setContent((oldCont) => {
    //   oldCont.forEach((c) => { if (c._id===content._id) c.title = title})
    //   return oldCont
    // })
  }
  
  useEffect (() => {
    onCompanyChange()
  }, [company, position, location, startDate, endDate, type])
  

  const onStartDateChange = (startDate?:Date) => {
    // setContent((oldCont) => oldCont.map((c) => c._id === content._id ? {...content, startDate} : c))
  }
  const onEndDateChange = (endDate?:Date) => {
    // setContent((oldCont) => oldCont.map((c) => c._id === content._id ? {...content, endDate} : c))
  }
  const onPositionChange = (position:string) => {
    // setContent((oldCont) => oldCont.map((c) => c._id === content._id ? {...content, position} : c))
    
  }
  const onLocationChange = (location:string) => {
    // setContent((oldCont) => oldCont.map((c) => c._id === content._id ? {...content, location} : c))
  }
  const onTypeChange = (type: ContentTypes) => {
    // setContent((oldCont) => oldCont.map((c) => c._id === content._id ? {...content, type} : c))
  }

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
        {/* <form> */}
          <div className="flex sm:flex-row flex-col sm:justify-between py-5 sm:gap-2">
            <div className="flex flex-col justify-betweeen gap-2">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="company">Company</Label>
                <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Amazon, Google, etc" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="position">Position</Label>
                <Input id="position" value={content.position} onChange={(e) => setPosition(e.target.value)} placeholder="eg. Software Engineer" />
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
                    onChange={(date) => setStartDate(date)}
                    text="Start Date"
                  />
                  <DatePicker
                    date={endDate}
                    onChange={(date) => setEndDate(date)}
                    text="End Date"
                  />
                </div>
              </div>
              <div className="flex flex-col  sm:flex-row justify-start gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" value={content.location} onChange={(e) => setLocation(e.target.value)} placeholder="eg. Ontario, Canada" />
                </div>
                <div className="flex">
                  <Selector
                    onValueChange={(val: string) =>
                      setType(val as ContentTypes)
                    }
                    label="Work Type"
                    placeholder="eg. Remote"
                    value={content.type}
                    items={selectorData}
                  />
                </div>
              </div>
            </div>
          </div>
          <DraggableBullets bullets={content.bullets || []}/>
        {/* </form> */}
      </CardContent>
    </Card>
  );
}, (prev, curr) => true );
