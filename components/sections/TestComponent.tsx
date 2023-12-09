"use client"
import { Button } from "@components/ui/button";
import { Card } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Separator } from "@components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@components/ui/tooltip";
import {
  DragDropContext,
  Draggable,
  DraggableProvidedDragHandleProps,
  DropResult,
  Droppable,
} from "@hello-pangea/dnd";
import cloneDeep from "lodash.clonedeep";
import {
  FileCheck2,
  FileEdit,
  FolderPlus,
  GitBranchPlus,
  Trash2,
} from "lucide-react";
import mongoose from "mongoose";
import React, { useEffect, useState } from "react";
import { BaseSection } from "./../../models/domain/Section";

type SectionTypes = "work" | "education" | "skills" | "projects";

interface Section {
  _id: string;
  title?: string;
  first: string;
  second: string;
  type: SectionTypes;
  newAdded?: boolean;
  content?: Content[];
  createdAt?: Date;
  updatedAt?: Date;
}

type ContentTypes = "full-time" | "hybrid" | "part-time" | "remote";

interface Content {
  _id: string;
  title: string;
  workType?: ContentTypes;
  position?: string;
  startDate?: Date;
  endDate?: Date;
  location?: string;
  bullets?: Bullet[];
}

interface Bullet {
  id: string;
  text: string;
}

const TestComponent = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const reorder = (list: Section[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const getDefaultSectionName = (type: SectionTypes) => {
    const defaultNames: Record<SectionTypes, string> = {
      work: "Work Experience",
      education: "Education",
      skills: "Skills",
      projects: "Projects"
    }
    return defaultNames[type]
  }

  const onSectionAdd = () => {
    const newSection: Section = {
      _id: new mongoose.Types.ObjectId().toString(),
      type: "work",
      title: getDefaultSectionName("work"),
      first: "",
      second: "",
      newAdded: true,
      content: [
        {
          _id: new mongoose.Types.ObjectId().toString(),
          title: "",
        },
      ],
    };
    setSections((oldSections) => {
      const newSections = cloneDeep(oldSections);
      newSections.push(newSection);
      return newSections;
    });
  };

  const onDragEnd = (result: DropResult) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      sections,
      result.source.index,
      result.destination.index
    );

    setSections(items);
  };

  useEffect(() => {
    const sections: Section[] = [
      {
        first: "First1",
        type: "work",
        title: getDefaultSectionName("work"),
        second: "Second1",
        _id: "1",
        content: [
          { title: "Google1_1", position: "Developer1_1", _id: "1_1" },
          { title: "Google1_2", position: "Developer1_2", _id: "1_2" },
        ],
      },
      {
        first: "First2",
        second: "Second2",
        type: "work",
        title: getDefaultSectionName("work"),
        _id: "2",
        content: [
          { title: "Google2_1", position: "Developer2_1", _id: "2_1" },
          { title: "Google2_2", position: "Developer2_2", _id: "2_2" },
        ],
      },
      {
        first: "First3",
        second: "Second3",
        type: "work",
        title: getDefaultSectionName("work"),
        _id: "3",
        content: [
          { title: "Google3_1", position: "Developer3_1", _id: "3_1" },
          { title: "Google3_2", position: "Developer3_2", _id: "3_2" },
        ],
      },
      {
        first: "First4",
        second: "Second4",
        type: "work",
        title: getDefaultSectionName("work"),
        _id: "4",
        content: [
          { title: "Google4_1", position: "Developer4_1", _id: "4_1" },
          { title: "Google4_2", position: "Developer4_2", _id: "4_2" },
        ],
      },
      {
        first: "First5",
        second: "Second5",
        type: "work",
        title: getDefaultSectionName("work"),
        _id: "5",
        content: [
          { title: "Google5_1", position: "Developer5_1", _id: "5_1" },
          { title: "Google5_2", position: "Developer5_2", _id: "5_2" },
        ],
      },
    ];
    setSections(sections);
  }, []);

  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="outerLevelDroppable">
          {(provided, snapshot) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {sections.map((section, index) => (
                <Draggable
                  key={section._id}
                  draggableId={section._id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      {...provided.draggableProps}
                      ref={provided.innerRef}
                      className="mb-3"
                    >
                      <Section
                        section={section}
                        setSections={setSections}
                        dragHandleProps={provided.dragHandleProps}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <Button
          onClick={onSectionAdd}
          className="bg-green-600 hover:bg-green-700"
        >
          <FolderPlus className="w-4 h-4 mr-3" />
          Add Section
        </Button>
      </DragDropContext>
    </div>
  );
};

const Section = ({
  section,
  setSections,
  dragHandleProps,
}: {
  section: Section;
  setSections: React.Dispatch<React.SetStateAction<Section[]>>;
  dragHandleProps: DraggableProvidedDragHandleProps | null;
}) => {
  const [editing, setEditing] = useState(!!section.newAdded);

  const onEditClick = () => {
    setEditing((old) => !old);
  };

  const onDeleteClick = () => {
    setSections((oldSections) =>
      cloneDeep(oldSections).filter((s) => s._id !== section._id)
    );
  };

  const onTitleChange = (newTitle: string) => {
    setSections((oldSections) => {
      const newSections = cloneDeep(oldSections)
      newSections.forEach((s) => {if (s._id === section._id) {
        s.title = newTitle
        return
      }})
      return newSections
    })
  }

  return (
    <div className="flex flex-row p-5 bg-white rounded-lg shadow-md w-full">
      <div
        className="flex flex-row mr-5  bg-slate-200 w-1 border-slate-200 border-2 rounded-sm"
        {...dragHandleProps}
      />
      <div className="flex flex-col flex-1 gap-3">
        <div className="flex flex-row justify-between items-center">
          {editing ? (
            <Input 
            className="max-w-[300px] w-fit"
            value={section.title} 
            onChange={(e) => onTitleChange(e.target.value)}
            />
          ) : (
            <h1 className="text-lg font-bold">{section.title}</h1>
          )}

          <div className="flex flex-row space-x-2">
            <Button
              className={
                editing
                  ? "text-green-500 hover:text-green-600"
                  : "text-amber-500 hover:text-amber-600"
              }
              variant="outline"
              size="icon"
              onClick={onEditClick}
            >
              {editing ? (
                <FileCheck2 className="w-4 h-4" />
              ) : (
                <FileEdit className="w-4 h-4" />
              )}
            </Button>
            <Button
              className="text-red-500 hover:text-red-700"
              variant="outline"
              size="icon"
              onClick={onDeleteClick}
            >
              <Trash2 className="w-4 h-4 " />
            </Button>
          </div>
        </div>

        <SectionContent
          section={section}
          setSections={setSections}
          editing={editing}
        />
      </div>
    </div>
  );
};

const SectionContent = ({
  section,
  setSections,
  editing,
}: {
  section: Section;
  setSections: React.Dispatch<React.SetStateAction<Section[]>>;
  editing: boolean;
}) => {
  const handleAddContent = () => {
    setSections((oldSections) => {
      const newSections = cloneDeep(oldSections);
      const newContent: Content = {
        _id: new mongoose.Types.ObjectId().toString(),
        title: "",
      };
      newSections.forEach((s) => {
        if (s._id === section._id) {
          s.content?.push(newContent);
          return;
        }
      });
      return newSections;
    });
  };

  const reorder = (list: Content[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd = (result: DropResult) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      section.content || [],
      result.source.index,
      result.destination.index
    );

    setSections((oldSections) => {
      const newSections = cloneDeep(oldSections);
      newSections.forEach((s) => {
        if (s._id === section._id) {
          s.content = items;
          return;
        }
      });
      return newSections;
    });
  };
  return (
    <div className="flex flex-col">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="innerLevelDroppable">
          {(provided, snapshot) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {section.content?.map((cont, index) => (
                <Draggable isDragDisabled={!editing} key={cont._id} draggableId={cont._id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.dragHandleProps}
                      {...provided.draggableProps}
                      ref={provided.innerRef}
                      className="pb-3"
                    >
                      <Content
                        sectionId={section._id}
                        content={cont}
                        key={cont._id}
                        setSections={setSections}
                        editing={editing}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        {editing && (
          <Button
            variant="ghost"
            onClick={handleAddContent}
            className="w-fit text-green-600 hover:text-green-700"
          >
            <GitBranchPlus className="w-4 h-4 mr-2" />
            Add Content
          </Button>
        )}
      </DragDropContext>
    </div>
  );
};

const Content = ({
  sectionId,
  setSections,
  content,
  editing,
}: {
  sectionId: string;
  content: Content;
  setSections: React.Dispatch<React.SetStateAction<Section[]>>;
  editing: boolean;
}) => {
  const onFieldEdit = <K extends keyof Content>(key: K, value: Content[K]) => {
    setSections((oldSections) => {
      const newSections = cloneDeep(oldSections);
      newSections.forEach((s) => {
        if (s._id === sectionId) {
          s.content?.forEach((c) => {
            if (c._id === content._id) {
              c[key] = value;
            }
          });
        }
      });
      return newSections;
    });
  };
  return (
    <Card>
      {/* <div className=" bg-white pl-10 flex flex-row gap-4 p-5 shadow-sm border-[1px] rounded-md border-slate-400"> */}
      <div className=" flex flex-row gap-4 p-5 flex-wrap	">
        {editing ? (
          <Input
            className="w-[200px]"
            value={content.position}
            onChange={(e) => onFieldEdit("position", e.target.value)}
          />
        ) : (
          <p>{content.position}</p>
        )}
        {editing ? (
          <Input
            className="w-[200px]"
            value={content.title}
            onChange={(e) => onFieldEdit("title", e.target.value)}
          />
        ) : (
          <p>{content.title}</p>
        )}
      </div>
    </Card>
  );
};

export default TestComponent;
