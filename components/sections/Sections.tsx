"use client"
import { DragDropContext, DropResult, Droppable } from "@hello-pangea/dnd";
import { BaseSection, SectionTypes } from "@models/domain/Section";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "@components/ui/button";
import { FilePlus2 } from "lucide-react";
import { Section } from "./Section";
import { useSession } from "next-auth/react";
import { AddSectionDropdown } from "./AddSectionDropdown";

interface SectionsDragListProps {
  sections: BaseSection[];
  setSections: Dispatch<SetStateAction<BaseSection[]>>;
}

const SectionsDragList = ({ sections, setSections }: SectionsDragListProps) => {
  const { data: session } = useSession();
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

  const SectionList = (function SectionList({
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
        key={section._id}
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
              <Button onClick={async () => {
                const response = await fetch(`api/sections`, {
                  method: "DELETE",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({id: "testId"}),
                });
                console.log(response)
              }}>TEST</Button>
              <Button
                className="w-1/4 mb-5"
                onClick={() => setisReorderMode((prev) => !prev)}
              >
                Reorder Sections
              </Button>
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
