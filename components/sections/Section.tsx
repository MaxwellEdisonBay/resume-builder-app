"use client"
import { Draggable } from "@hello-pangea/dnd";
import {
  BaseDeleteById,
  BaseSection,
  SectionTypes,
} from "@models/domain/Section";
import { Dispatch, SetStateAction, createContext, useState } from "react";
import ContentDragList from "./Content";
import { Button } from "@components/ui/button";
import {
  Check,
  FileEdit,
  GitBranchPlus,
  Loader2,
  Pencil,
  Trash2,
} from "lucide-react";
import SectionDisplayMode from "./SectionDisplayMode";
import DeleteDialogButton from "./DeleteDialogButton";
import { showToast } from "@utils/toast";
import { BaseErrorResponse } from "@models/dto/error";
import { BaseSectionContent } from "@models/domain/SectionContent";
import mongoose from "mongoose";
import cloneDeep from "lodash.clonedeep";

export const ContentContext = createContext<{
  content?: BaseSection[];
  setContent?: Dispatch<SetStateAction<BaseSection[]>>;
}>({});

export const Section = ({
  section,
  setSections,
  index,
  isReorderMode,
}: {
  section: BaseSection;
  setSections: Dispatch<SetStateAction<BaseSection[]>>;
  index: number;
  isReorderMode: boolean;
}) => {

  // const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // const [content, setContent] = useState<BaseSectionContent[]>(section.content);
  const getSectionDefaultName = (section: SectionTypes) => {
    switch (section) {
      case "work":
        return "Work Experience";
      case "education":
        return "Education";
      case "projects":
        return "Projects";
      case "skills":
        return "Skills";
      default:
        return "Section";
    }
  };

  const removeSectionFromCache = (id: string) => {
    setSections((oldSections) => oldSections.filter((s) => s._id !== id));
  };

  const handleAddContent = () => {
    const newContent: BaseSectionContent = {
      _id: new mongoose.Types.ObjectId().toString(),
      title: "Test",
    };
    setSections((oldSections) => {
      const clone = cloneDeep(oldSections)
      const newSections = [...clone]
      newSections.forEach((s) => {
        if (s._id === section._id) s.content.push(newContent);
      });
      console.log({newSections})
      return newSections;
    });
    // console.log(content);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(`api/sections`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: section._id } as BaseDeleteById),
      });
      const data = await response.json();
      if (response.status === 200) {
        const deletedSection = data as BaseSection;
        console.log("DELETE: " + deletedSection._id);
        removeSectionFromCache(deletedSection._id || "");
        showToast({ message: "Section deleted successfully", type: "success" });
      } else {
        const errorData = data as BaseErrorResponse;
        showToast({ message: "Error: " + errorData.message, type: "error" });
      }
      setLoading(false);
    } catch (e) {
      const errorMessage =
        e instanceof Error
          ? e.message
          : "An exception occurred while deleting a section";
      showToast({ message: errorMessage, type: "error" });
      setLoading(false);
    }
  };
  const handleEdit = () => {
    setSections((oldSections) => {
      const newSections = cloneDeep(oldSections)
      newSections.forEach((s) => {if (s._id === section._id) s.editing = !s.editing})
      return newSections
    })
  };
  return (
    <Draggable
      draggableId={section._id || ""}
      index={index}
      isDragDisabled={!isReorderMode}
    >
      {(providedSection) => (
        <div
          className={`flex flex-row items-stretch bg-white rounded-lg shadow-md mb-2 w-full select-none pl-5`}
          ref={providedSection.innerRef}
          {...providedSection.draggableProps}
        >
          {isReorderMode && (
            <div
              className={`flex flex-row justify-center py-5 pr-5`}
              {...providedSection.dragHandleProps}
            >
              <div className="flex bg-slate-300  w-1 rounded-lg "></div>
            </div>
          )}

          <div className="flex flex-col py-5 pr-5  flex-1">
            <div className="flex flex-row justify-between">
              <h1 className="text-xl font-bold">
                {getSectionDefaultName(section.type)}
              </h1>
              {!isReorderMode && (
                <div className="flex flex-row pr-5 gap-2">
                  {section.editing ? (
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-green-400 hover:text-green-500"
                      onClick={handleEdit}
                      disabled={loading || isReorderMode}
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-amber-400 hover:text-amber-500"
                      onClick={handleEdit}
                      disabled={loading || isReorderMode}
                    >
                      <FileEdit className="h-4 w-4" />
                    </Button>
                  )}
                  <DeleteDialogButton
                    loading={loading}
                    disabled={isReorderMode}
                    onDelete={handleDelete}
                  />
                </div>
              )}
            </div>
            {section.editing ? (
              <ContentDragList
                section={section}
                content={section.content}
                setSections={setSections}
              />
            ) : (
              <SectionDisplayMode
                key={section._id}
                section={section}
                isReorderMode={isReorderMode}
              />
            )}
            {!isReorderMode && section.editing && (
              <Button
                className="max-w-fit text-green-600 hover:text-green-700"
                variant="ghost"
                onClick={handleAddContent}
              >
                <GitBranchPlus className="h-4 w-4 mr-3" /> Add Content
              </Button>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};
