import { DragDropContext, DropResult, Droppable } from "@hello-pangea/dnd";
import { BaseSection, SectionTypes } from "@models/domain/Section";
import { BaseSectionContent } from "@models/domain/SectionContent";
import cloneDeep from "lodash.clonedeep";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { SectionContent } from "./WorkExperienceSection";

export interface ContentProps {
  section: BaseSection;
  setSections: Dispatch<SetStateAction<BaseSection[]>>;
  content: BaseSectionContent[];
}

export const ContentDragList = ({
  section,
  content,
  setSections,
}: ContentProps) => {
  const [isBrowser, setIsBrowser] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsBrowser(true);
    }
  }, []);

  function onDragEnd(result: DropResult) {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    setSections((sections) => {
      const newSections = cloneDeep(sections);
      const ind = newSections.findIndex((s) => section._id === s._id);
      newSections[ind].content = reorderContent(
        newSections[ind].content,
        result.source.index,
        result?.destination?.index || 0
      );
      return newSections;
    });
  }

  // const handleContentChange = (newContent: BaseSectionContent) => {
  //   setContent((oldContent) => oldContent.map((cont) => cont._id === newContent._id ? newContent : cont))
  // }

  const reorderContent = (
    list: BaseSectionContent[],
    startIndex: number,
    endIndex: number
  ) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const ContentList = React.memo(function ContentList({
    // const ContentList = (function ContentList({
    type,
    content,
  }: {
    type: SectionTypes;
    content: BaseSectionContent[];
  }) {
    return content.map((c: BaseSectionContent, index: number) => (
      <SectionContent
        key={c._id}
        index={index}
        type={type}
        content={c}
        setSection={setSections}
        onChange={(cont) => {
          setSections((oldSec) => {
            // const newSec = cloneDeep(oldSec)
            oldSec.forEach((s) => {if (s._id===section._id) {
              s.content = s.content.map((c) => c._id === cont._id ? cont : c)
            }})
            return oldSec
          })
        }}
      />
    ));
  });
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {isBrowser && (
        <Droppable droppableId="listContent">
          {(providedContent) => (
            <div
              className="flex w-full flex-col"
              ref={providedContent.innerRef}
              {...providedContent.droppableProps}
            >
              <ContentList
                type={section.type}
                content={content}
              />

              {providedContent.placeholder}
            </div>
          )}
        </Droppable>
      )}
    </DragDropContext>
  );
};

export default ContentDragList;
