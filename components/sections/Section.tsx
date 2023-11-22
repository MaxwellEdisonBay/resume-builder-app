import { Draggable } from "@hello-pangea/dnd";
import { BaseSection, SectionTypes } from "@models/domain/Section";
import { Dispatch, SetStateAction } from "react";
import ContentDragList from "./Content";



export const Section = ({
    section,
    setSections,
    index,
  }: {
    section: BaseSection;
    setSections: Dispatch<SetStateAction<BaseSection[]>>;
    index: number;
  }) => {
    const getSectionDefaultName = (section: SectionTypes) => {
        switch(section) {
            case "work": return "Work Experience"
            case "education": return "Education"
            case "projects" : return "Projects"
            case "skills" : return "Skills"
            default:
                return "Section"
        }
    }
    return (
      <Draggable draggableId={section.id} index={index}>
        {(providedSection) => (
          <div
            className=" flex flex-row items-stretch bg-white rounded-lg shadow-md mb-2 w-full select-none"
            ref={providedSection.innerRef}
            {...providedSection.draggableProps}
          >
            <div
              className={`flex flex-row justify-center p-5`}
              {...providedSection.dragHandleProps}
            >
              <div className="flex bg-slate-300  w-1 rounded-lg "></div>
            </div>
  
            <div className="flex flex-col py-5 pr-5  flex-1">
              <h1 className="text-xl font-bold">{getSectionDefaultName(section.type)}</h1>
              <ContentDragList setSections={setSections} section={section} />
            </div>
          </div>
        )}
      </Draggable>
    );
  };