"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import {
  DragDropContext,
  Draggable,
  DraggableProvidedDragHandleProps,
  DropResult,
  Droppable,
} from "@hello-pangea/dnd";
import { zodResolver } from "@hookform/resolvers/zod";
import { Content } from "@models/domain/Content";
import { BaseDeleteById, Section, SectionTypes } from "@models/domain/Section";
import { BaseErrorResponse } from "@models/dto/error";
import { mapFormDataToContent } from "@utils/dataMappers";
import { SectionSchemas, getSectionSchema } from "@utils/inputSchemas";
import cloneDeep from "lodash.clonedeep";
import { FileCheck2, FileEdit, GitBranchPlus, Undo, X } from "lucide-react";
import mongoose from "mongoose";
import React, { Dispatch, SetStateAction, useState } from "react";
import { Control, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import ContentDisplay from "./ContentDisplay";
import ContentForm from "./ContentForms";
import DeleteDialogButton from "./DeleteDialogButton";
import AddSectionSelect from "./new/AddSectionSelect";

export interface TestComponentProps {
  userId: string;
  sections: Section[];
  setSections: Dispatch<SetStateAction<Section[]>>;
}

const SectionsComponent = ({
  userId,
  sections,
  setSections,
}: TestComponentProps) => {
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
      projects: "Projects",
    };
    return defaultNames[type];
  };

  const handleSectionAdd = (sectionType: SectionTypes) => {
    const newSection: Section = {
      userId,
      _id: new mongoose.Types.ObjectId().toString(),
      type: sectionType,
      title: getDefaultSectionName(sectionType),
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
        <AddSectionSelect onSectionSelect={handleSectionAdd} />
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
  const [loading, setLoading] = useState(false);

  const sectionSchema = getSectionSchema(section.type);

  const form = useForm<z.infer<typeof sectionSchema>>({
    resolver: zodResolver(sectionSchema),
    mode: "onChange",
  });

  const onEditClick = (e: any) => {
    if (!editing) {
      e.preventDefault();
      setEditing((old) => {
        return !old;
      });
    }
  };

  const onError = (e: any) => {
    console.log(e);
  };
  

  const onSubmit = async (data: z.infer<typeof sectionSchema>, e: any) => {
    // console.log(data, e);
    // console.log({ dirty: !!form.formState.isDirty });
    const updatedSection = cloneDeep(section);
    mapFormDataToContent(data, updatedSection);
    console.log({ updatedSection });
    let resultSectionRs: Section | undefined;
    if (updatedSection.newAdded) {
      resultSectionRs = await addNewSection({
        ...updatedSection,
        newAdded: false,
      });
    } else {
      resultSectionRs = await updateSection(updatedSection);
    }
    if (resultSectionRs) {
      setSections((oldSections) => {
        const newSections = cloneDeep(oldSections).map((s) =>
          s._id === updatedSection._id ? {
            ...updatedSection,
            newAdded: false,
          } : s
        );
        return newSections;
      });
      resetFormAndClose();
    }
  };

  const handleUndo = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    resetFormAndClose()
    if (section.newAdded) {
      removeSectionFromCache()
    }
  }

  const resetFormAndClose = () => {
    form.reset();
    setEditing(false);
  };

  const handleSectionDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(`api/sections`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: section._id } as BaseDeleteById),
      });
      const data = await response.json();
      if (response.status === 200) {
        const deletedSection = data as Section;
        console.log("DELETE: " + deletedSection._id);
        removeSectionFromCache();
        toast.success("Section deleted successfully");
      } else {
        const errorData = data as BaseErrorResponse;
        toast.error("Error: " + errorData.message);
      }
      setLoading(false);
    } catch (e) {
      const errorMessage =
        e instanceof Error
          ? e.message
          : "An exception occurred while deleting a section";
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  const removeSectionFromCache = () => {
    setSections((oldSections) =>
      cloneDeep(oldSections).filter((s) => s._id !== section._id)
    );
  };

  const addNewSection = async (newSection: Section) => {
    try {
      const response = await fetch(`api/sections`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSection),
      });
      const newSectionRs: Section = await response.json();
      console.log({ newSectionRs });
      toast.success("Added a new section successfully.");
      return newSectionRs;
    } catch (e: any) {
      toast.error(
        "Error occurred: " + (e instanceof Error) ? e.message : "Unknown"
      );
      return undefined;
    }
  };

  const updateSection = async (updatedSection: Section) => {
    try {
      const response = await fetch(`api/sections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSection),
      });
      const updatedSectionRs: Section = await response.json();
      console.log({ updatedSectionRs });
      toast.success("Added a new section successfully.");
      return updatedSectionRs;
    } catch (e: any) {
      toast.error(
        "Error occurred: " + (e instanceof Error) ? e.message : "Unknown"
      );
      return undefined;
    }
  };

  const shouldShowSaveButton = !(editing && !form.formState.isDirty);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)}>
        <div className="flex flex-row p-5 bg-white rounded-lg shadow-md w-full">
          <div
            className="flex flex-row mr-5  bg-slate-200 w-1 border-slate-200 border-2 rounded-sm"
            {...dragHandleProps}
          />
          <div className="flex flex-col flex-1 gap-3">
            <div className="flex flex-row justify-between items-center">
              {editing ? (
                <FormField
                  defaultValue={section.title}
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input className="max-w-[300px] w-fit" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <h1 className="text-lg font-bold">{section.title}</h1>
              )}

              <div className="flex flex-row space-x-2">
                {editing && (
                  <Button
                    disabled={loading}
                    type="submit"
                    className="text-amber-500 hover:text-amber-600"
                    variant="outline"
                    size="icon"
                    onClick={handleUndo}
                  >
                    <Undo className="w-4 h-4" />
                  </Button>
                )}
                {shouldShowSaveButton && (
                  <Button
                    type="submit"
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
                )}
                <DeleteDialogButton
                  loading={loading}
                  disabled={false}
                  onDelete={handleSectionDelete}
                />
                {/* <Button
                  className="text-red-500 hover:text-red-700"
                  variant="outline"
                  size="icon"
                  onClick={onDeleteClick}
                >
                  <Trash2 className="w-4 h-4 " />
                </Button> */}
              </div>
            </div>
            <SectionContent
              section={section}
              setSections={setSections}
              editing={editing}
              formControl={form.control}
            />
          </div>
        </div>
      </form>
    </Form>
  );
};

const SectionContent = ({
  section,
  setSections,
  editing,
  formControl,
}: {
  section: Section;
  setSections: React.Dispatch<React.SetStateAction<Section[]>>;
  editing: boolean;
  formControl: Control<z.infer<SectionSchemas>, any>;
}) => {
  const isNotLastContent =
    section.content?.length && section.content?.length > 1;

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

  const handleRemoveContent = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    content: Content
  ) => {
    e.preventDefault();
    formControl.unregister(`content.${content._id}`);
    setSections((oldSections) => {
      const newSections = cloneDeep(oldSections);
      newSections.forEach((s) => {
        if (s._id === section._id) {
          s.content = s.content?.filter((c) => c._id !== content._id);
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
                <Draggable
                  isDragDisabled={!editing}
                  key={cont._id}
                  draggableId={cont._id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      {...provided.dragHandleProps}
                      {...provided.draggableProps}
                      ref={provided.innerRef}
                      className="pb-3"
                    >
                      {editing ? (
                        <div className="flex flex-row w-full">
                          <ContentForm
                            formControl={formControl}
                            sectionType={section.type}
                            content={cont}
                          />
                          {isNotLastContent && (
                            <Button
                              type="button"
                              className="text-red-500 hover:text-red-700"
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                handleRemoveContent(e, cont);
                              }}
                            >
                              <X className="w-4 h-4 " />
                            </Button>
                          )}
                        </div>
                      ) : (
                        <ContentDisplay
                          sectionType={section.type}
                          content={cont}
                        />
                      )}
                      {/* <Content
                        sectionId={section._id}
                        content={cont}
                        key={cont._id}
                        setSections={setSections}
                        editing={editing}
                        formControl={formControl}
                      /> */}
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
            type="button"
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

// const Content = ({
//   sectionId,
//   setSections,
//   content,
//   editing,
//   formControl,
// }: {
//   sectionId: string;
//   content: Content;
//   setSections: React.Dispatch<React.SetStateAction<Section[]>>;
//   editing: boolean;
//   formControl: Control<z.infer<SectionSchemas>, any>;
// }) => {
//   const onFieldEdit = <K extends keyof Content>(key: K, value: Content[K]) => {
//     setSections((oldSections) => {
//       const newSections = cloneDeep(oldSections);
//       newSections.forEach((s) => {
//         if (s._id === sectionId) {
//           s.content?.forEach((c) => {
//             if (c._id === content._id) {
//               c[key] = value;
//             }
//           });
//         }
//       });
//       return newSections;
//     });
//   };
//   return (
//     <Card>
//       {/* <div className=" bg-white pl-10 flex flex-row gap-4 p-5 shadow-sm border-[1px] rounded-md border-slate-400"> */}
//       <div className=" flex flex-row gap-4 p-5 flex-wrap	">
//         {editing ? (
//           <FormField
//             defaultValue={content.title}
//             control={formControl}
//             name={`content.${content._id}.title`}
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Company</FormLabel>
//                 <FormControl>
//                   <Input placeholder="eg. Google" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         ) : (
//           <p>{content.position}</p>
//         )}
//         {editing ? (
//           <Input
//             className="w-[200px]"
//             value={content.title}
//             onChange={(e) => onFieldEdit("title", e.target.value)}
//           />
//         ) : (
//           <p>{content.title}</p>
//         )}
//       </div>
//     </Card>
//   );
// };

export default SectionsComponent;
