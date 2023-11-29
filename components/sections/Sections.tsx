import { DragDropContext, DropResult, Droppable } from "@hello-pangea/dnd";
import { BaseSection } from "@models/domain/Section";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Section } from "./Section";
import { Button } from "@components/ui/button";
import { FilePlus2 } from "lucide-react";

interface SectionsDragListProps {
  sections: BaseSection[];
  setSections: Dispatch<SetStateAction<BaseSection[]>>;
}

const SectionsDragList = ({ sections, setSections }: SectionsDragListProps) => {
  const [isReorderMode, setisReorderMode] = useState(false);
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
        isReorderMode={isReorderMode}
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
              <Button
                className="w-1/4 mb-5"
                onClick={() => setisReorderMode((prev) => !prev)}
              >
                Reorder Sections
              </Button>
              <SectionList setSections={setSections} sections={sections} />
              <Button className="max-w-fit bg-green-600 hover:bg-green-700">
                <FilePlus2 className="w-8 h-8 pr-3" /> Add Section
              </Button>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      )}
    </DragDropContext>
  );
};

export default SectionsDragList;
