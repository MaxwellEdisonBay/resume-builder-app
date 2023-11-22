import {
  DragDropContext,
  DropResult,
  Droppable
} from "@hello-pangea/dnd";
import { BaseSection } from "@models/domain/Section";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Section } from "./Section";


interface SectionsDragListProps {
  sections: BaseSection[];
  setSections: Dispatch<SetStateAction<BaseSection[]>>;
}

const SectionsDragList = ({ sections, setSections }: SectionsDragListProps) => {
  const [isBrowser, setIsBrowser] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsBrowser(true);
    }
  }, []);

  const reorderSections = (
    list: BaseSection[],
    startIndex: number,
    endIndex: number
  ) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  function onDragEnd(result: DropResult) {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    setSections((sections) =>
      reorderSections(
        sections,
        result.source.index,
        result?.destination?.index || 0
      )
    );
  }

  const SectionList = React.memo(function SectionList({
    sections,
    setSections,
  }: {
    sections: BaseSection[];
    setSections: Dispatch<SetStateAction<BaseSection[]>>;
  }) {
    return sections.map((section: BaseSection, index: number) => (
      <Section
        setSections={setSections}
        section={section}
        index={index}
        key={section.id}
      />
    ));
  });

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {isBrowser && (
        <Droppable droppableId="list">
          {(provided) => (
            <div
              className="flex w-full flex-col"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <SectionList setSections={setSections} sections={sections} />
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      )}
    </DragDropContext>
  );
};

export default SectionsDragList;
