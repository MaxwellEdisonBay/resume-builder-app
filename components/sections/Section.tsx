import { Draggable } from "@hello-pangea/dnd";
import { BaseSection, SectionTypes } from "@models/domain/Section";
import { Dispatch, SetStateAction, useState } from "react";
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
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
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
  const handleEdit = () => {
    setEditing((prev) => !prev);
  };
  return (
    <Draggable
      draggableId={section.id}
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
                  {editing ? (
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
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-red-400 hover:text-red-700"
                    disabled={loading || isReorderMode}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              )}
            </div>
            {editing ? (
              <ContentDragList setSections={setSections} section={section} />
            ) : (
              <SectionDisplayMode
                section={section}
                isReorderMode={isReorderMode}
              />
            )}
            {!isReorderMode && editing && (
              <Button
                className="max-w-fit text-green-600 hover:text-green-700"
                variant="ghost"
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
