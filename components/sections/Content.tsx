import { DragDropContext, DropResult, Droppable } from '@hello-pangea/dnd';
import { BaseSection, SectionTypes } from '@models/domain/Section';
import { BaseSectionContent } from '@models/domain/SectionContent';
import cloneDeep from 'lodash.clonedeep';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { SectionContent } from './WorkExperienceSection';

export interface ContentProps {
    setSections: Dispatch<SetStateAction<BaseSection[]>>;
    section: BaseSection;
}

export const ContentDragList = ({setSections, section} : ContentProps) => {
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
        const ind = newSections.findIndex((s) => section.id === s.id);
        newSections[ind].content = reorderContent(
          newSections[ind].content,
          result.source.index,
          result?.destination?.index || 0
        );
        return newSections;
      });
    }
  
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
      type,
      content,
      setSections,
    }: {
      type: SectionTypes;
      content: BaseSectionContent[];
      setSections: Dispatch<SetStateAction<BaseSection[]>>;
    }) {
      return content.map((c: BaseSectionContent, index: number) => (
        <SectionContent
          index={index}
          type={type}
          content={c}
          onChange={() => {}}
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
                        content={section.content}
                        setSections={setSections}
                      />

                      {providedContent.placeholder}
                    </div>
                  )}
                </Droppable>
              )}
            </DragDropContext>
  )
}

export default ContentDragList