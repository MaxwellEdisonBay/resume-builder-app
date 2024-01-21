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
import { cn } from "@lib/utils";
import { Content } from "@models/domain/Content";
import { BaseDeleteById, Section, SectionTypes } from "@models/domain/Section";
import { BaseErrorResponse } from "@models/dto/error";
import { SectionSchemas, getSectionSchema } from "@utils/inputSchemas";
import { sectionTypesList } from "@utils/textUtils";
import cloneDeep from "lodash.clonedeep";
import { FileCheck2, FileEdit, GitBranchPlus, Undo, X } from "lucide-react";
import mongoose from "mongoose";
import React, { Dispatch, SetStateAction, useState } from "react";
import {
  Control,
  UseFormReturn,
  UseFormWatch,
  useFieldArray,
  useForm,
} from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import ContentDisplay from "./ContentDisplay";
import DeleteDialogButton from "./DeleteDialogButton";
import { SectionIcon } from "./SectionIcon";
import ContentForm from "./content-forms/ContentForms";
import AddSectionSelect from "./new/AddSectionSelect";

export interface SectionComponentProps {
  userId: string;
  resumeId: string;
  sections: Section[];
  setSections: Dispatch<SetStateAction<Section[] | undefined>>;
  handleSectionAdd: (section: SectionTypes) => void;
}

const SectionsComponent = ({
  userId,
  resumeId,
  sections,
  setSections,
  handleSectionAdd,
}: SectionComponentProps) => {
  const [isSectionReorder, setSectionReorder] = useState(false);
  const reorder = (list: Section[], startIndex: number, endIndex: number) => {
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
      sections,
      result.source.index,
      result.destination.index
    );

    setSections(items);
  };

  const getAvailableSections = () => {
    const currentSections = sections.map((s) => s.type);
    return sectionTypesList.filter((t) => !currentSections.includes(t));
  };

  const sectionsTypesAvailable = getAvailableSections();
  console.log({ sectionsTypesAvailable });

  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="outerLevelDroppable" isDropDisabled={true}>
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
                        isSectionReorder={isSectionReorder}
                        resumeId={resumeId}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        {!!sectionsTypesAvailable.length && (
          <div className="flex flex-row justify-between">
            <AddSectionSelect
              sectionsTypesAvailable={sectionsTypesAvailable}
              onSectionSelect={handleSectionAdd}
            />
          </div>
        )}
      </DragDropContext>
    </div>
  );
};

const Section = ({
  section,
  setSections,
  dragHandleProps,
  isSectionReorder,
  resumeId,
}: {
  section: Section;
  setSections: React.Dispatch<React.SetStateAction<Section[] | undefined>>;
  dragHandleProps: DraggableProvidedDragHandleProps | null;
  isSectionReorder: boolean;
  resumeId: string;
}) => {
  const [editing, setEditing] = useState(!!section.newAdded);
  const [loading, setLoading] = useState(false);

  const sectionSchema = getSectionSchema(section.type);

  const form = useForm<z.infer<typeof sectionSchema>>({
    resolver: zodResolver(sectionSchema),
    mode: "onChange",
    defaultValues: {
      title: section.title,
      content: section.content?.map((c) => {
        return { ...c, isEndPresent: c.startDate && !c.endDate };
      }),
    },
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
    const updatedSection: Section = {
      ...cloneDeep(section),
      title: data.title,
      content: data.content as Content[],
    };
    // console.log({ updatedSection });
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
        const newSections = cloneDeep(oldSections)?.map((s) =>
          s._id === updatedSection._id
            ? {
                ...updatedSection,
                newAdded: false,
              }
            : s
        );
        return newSections;
      });

      resetFormAndClose(updatedSection);
    } else {
      resetFormAndClose();
    }
  };

  const handleUndo = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    resetFormAndClose();
    if (section.newAdded) {
      removeSectionFromCache();
    }
  };

  const makeInvalidateCall = async () => {
    const response = await fetch(`/api/resumes/${resumeId}/invalidate`, {
      method: "POST",
    });
    if (!response.ok) {
      toast.error("Failed to invalidate generated PDF after resume change.");
    }
  };

  const resetFormAndClose = (updatedSection: Section = section) => {
    form.reset({
      title: updatedSection.title,
      content: updatedSection.content?.map((c) => {
        return { ...c, isEndPresent: c.startDate && !c.endDate };
      }),
    });
    setEditing(false);
  };

  const handleSectionDelete = async () => {
    if (section.newAdded) {
      removeSectionFromCache();
    } else {
      setLoading(true);
      try {
        await makeInvalidateCall();
        const response = await fetch(`/api/sections`, {
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
    }
  };

  const removeSectionFromCache = () => {
    setSections((oldSections) =>
      cloneDeep(oldSections)?.filter((s) => s._id !== section._id)
    );
  };

  const addNewSection = async (newSection: Section) => {
    try {
      setLoading(true);
      await makeInvalidateCall();
      const response = await fetch(`/api/sections`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSection),
      });
      const newSectionRs: Section = await response.json();
      console.log({ newSectionRs });
      toast.success("Added a new section successfully.");
      setLoading(false);
      return newSectionRs;
    } catch (e: any) {
      toast.error(
        "Error occurred: " + (e instanceof Error) ? e.message : "Unknown"
      );
      setLoading(false);
      return undefined;
    }
  };

  const updateSection = async (updatedSection: Section) => {
    try {
      setLoading(true);
      await makeInvalidateCall();
      const response = await fetch(`/api/sections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSection),
      });
      const updatedSectionRs: Section = await response.json();
      console.log({ updatedSectionRs });
      toast.success("Added a new section successfully.");
      setLoading(false);
      return updatedSectionRs;
    } catch (e: any) {
      toast.error(
        "Error occurred: " + (e instanceof Error) ? e.message : "Unknown"
      );
      setLoading(false);
      return undefined;
    }
  };

  const shouldShowSaveButton = !(editing && !form.formState.isDirty);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)}>
        <div className="flex flex-row p-5 bg-white rounded-lg shadow-md w-full">
          <div
            className={cn(
              isSectionReorder ? "flex" : "hidden",
              "flex-row mr-5  bg-slate-200 w-1 border-slate-200 border-2 rounded-sm"
            )}
            {...dragHandleProps}
          />
          <div className="flex flex-col w-full gap-3">
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
                <div className="flex flex-row gap-3 items-center">
                  <SectionIcon type={section.type} />
                  <h1 className="text-lg font-bold">{section.title}</h1>
                </div>
              )}

              <div className="flex flex-row space-x-2">
                {editing && !section.newAdded && (
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
                    disabled={loading}
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
              </div>
            </div>
            {editing ? (
              <SectionContent
                section={section}
                setSections={setSections}
                editing={editing}
                form={form}
                formControl={form.control}
                formWatch={form.watch}
                loading={loading}
              />
            ) : (
              section?.content?.map((c) => (
                <ContentDisplay
                  key={c._id}
                  sectionType={section.type}
                  content={c}
                />
              ))
            )}
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
  form,
  formControl,
  formWatch,
  loading,
}: {
  section: Section;
  setSections: React.Dispatch<React.SetStateAction<Section[] | undefined>>;
  editing: boolean;
  form: UseFormReturn<z.infer<SectionSchemas>, any>;
  formControl: Control<z.infer<SectionSchemas>, any>;
  formWatch: UseFormWatch<z.infer<SectionSchemas>>;
  loading: boolean;
}) => {
  const { fields, append, remove, move } = useFieldArray({
    name: "content",
    control: formControl,
  });
  const isNotLastContent = fields.length > 1;

  const handleAddContent = () => {
    const newContent: Content = {
      _id: new mongoose.Types.ObjectId().toString(),
      title: "",
      position: "",
      location: "",
    };
    append(newContent as (typeof fields)[0]);
  };

  const handleRemoveContent = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number
  ) => {
    e.preventDefault();
    remove(index);
  };

  const onDragEnd = (result: DropResult) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    const start = result.source.index;
    const destination = result?.destination?.index;
    move(start, destination);
  };

  const addContentButtonText: Record<SectionTypes, string> = {
    work: "Add work experience",
    skills: "Add skills",
    projects: "Add a project",
    education: "Add education",
  };

  return (
    <div className="flex flex-col">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="innerLevelDroppable">
          {(provided, snapshot) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {fields.map((cont, index) => (
                <Draggable
                  isDragDisabled={!editing || !isNotLastContent}
                  key={cont._id}
                  draggableId={cont._id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      {...provided.draggableProps}
                      ref={provided.innerRef}
                      className="pb-3"
                    >
                      <div className="flex flex-row w-full">
                        <div
                          className={cn(
                            editing && isNotLastContent ? "flex" : "hidden",
                            "flex-row mr-5  bg-slate-200 w-1 border-slate-200 border-2 rounded-sm"
                          )}
                          {...provided.dragHandleProps}
                        />
                        <ContentForm
                          form={form}
                          formControl={formControl}
                          formWatch={formWatch}
                          sectionType={section.type}
                          content={cont as Content}
                          index={index}
                        />
                        {isNotLastContent && (
                          <Button
                            type="button"
                            disabled={loading}
                            className="text-red-500 hover:text-red-700"
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              handleRemoveContent(e, index);
                            }}
                          >
                            <X className="w-4 h-4 " />
                          </Button>
                        )}
                      </div>
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
            disabled={loading}
            variant="ghost"
            type="button"
            onClick={handleAddContent}
            className="w-fit text-green-600 hover:text-green-700"
          >
            <GitBranchPlus className="w-4 h-4 mr-2" />
            {addContentButtonText[section.type]}
          </Button>
        )}
      </DragDropContext>
    </div>
  );
};
export default SectionsComponent;
