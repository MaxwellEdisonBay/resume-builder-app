"use client";
import { SectionTypes } from "@models/domain/Section";
import React from "react";
import { WorkContentForm } from "./ui/WorkContentForm"
import { ContentFormProps } from "./types";

const ContentForm = ({
  formControl,
  formWatch,
  form,
  sectionType,
  content,
  index,
}: ContentFormProps) => {
  const forms: Record<SectionTypes, React.ReactNode> = {
    work: (
      <WorkContentForm
        form={form}
        index={index}
        formControl={formControl}
        formWatch={formWatch}
        content={content}
      />
    ),
    education: <div className="">Education Form</div>,
    skills: <div className="">Skills Form</div>,
    projects: <div className="">Projects Form</div>,
  };
  return forms[sectionType];
};


export default ContentForm;
