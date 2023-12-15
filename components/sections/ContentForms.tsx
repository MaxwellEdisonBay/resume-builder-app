"use client"
import { Card } from "@components/ui/card";
import React, { useEffect, useState } from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Control, UseFormReturn, UseFormWatch } from "react-hook-form";
import { z } from "zod";
import {
  WorkFormSchema,
  EducationFormSchema,
  SectionSchemas,
} from "@utils/inputSchemas";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import { Button } from "@components/ui/button";
import { cn } from "@lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { Checkbox } from "@components/ui/checkbox";
import { Content, WorkTypes, workTypesNames } from "@models/domain/Content";
import { SectionTypes } from "@models/domain/Section";

interface BaseContentFormProps {
  content: Content;
  form: UseFormReturn<z.infer<SectionSchemas>, any>;
  formWatch: UseFormWatch<z.infer<SectionSchemas>>;
  formControl: Control<z.infer<SectionSchemas>, any>;
  index: number
}

export interface ContentFormProps extends BaseContentFormProps {
  sectionType: SectionTypes;
}

const ContentForm = ({
  formControl,
  formWatch,
  form,
  sectionType,
  content,
  index,
}: ContentFormProps) => {
  const forms: Record<SectionTypes, React.ReactNode> = {
    work: <WorkContentForm form={form} index={index} formControl={formControl} formWatch={formWatch} content={content} />,
    education: <div className="">Education Form</div>,
    skills: <div className="">Skills Form</div>,
    projects: <div className="">Projects Form</div>,
  };
  return forms[sectionType];
};

const WorkContentForm = ({ content, formControl, formWatch, index, form }: BaseContentFormProps) => {
  const workFormControl = formControl as unknown as Control<
    z.infer<typeof WorkFormSchema>,
    any
  >;
  // const isPresentDefault = content.startDate && !content.endDate
  const isPresent = form.watch(`content.${index}.isEndPresent`)

  useEffect(() => {
    if (isPresent) {
      form.setValue(`content.${index}.endDate`, undefined)
    }
  }, [isPresent])
  // const [isPresentWork, setIsPresentWork] = useState(isPresentDefault);
  return (
    <Card className="w-full">
      {/* <div className=" bg-white pl-10 flex flex-row gap-4 p-5 shadow-sm border-[1px] rounded-md border-slate-400"> */}
      <div className=" flex flex-row gap-4 p-5 flex-wrap justify-between">
        <div className="flex flex-col gap-4">
          <FormField
            // defaultValue={content.title || ""}
            control={workFormControl}
            name={`content.${index}.title`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Input placeholder="eg. Google" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            // defaultValue={content.position || ""}
            control={workFormControl}
            name={`content.${index}.position`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position</FormLabel>
                <FormControl>
                  <Input placeholder="eg. Software Engineer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col pt-2">
          <div className="flex flex-row gap-3 mb-2 flex-wrap">
            <FormField
              // defaultValue={content.startDate && new Date(content.startDate)}
              control={workFormControl}
              name={`content.${index}.startDate`}
              render={({ field }) => {
                const [open, setOpen] = useState(false);
                return (
                  <FormItem className="flex flex-col ">
                    <FormLabel>Start Date</FormLabel>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              <p>
                                {field.value.toLocaleDateString()}
                              </p>
                            ) : (
                              <span>Pick start date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          captionLayout="dropdown-buttons"
                          selected={field.value}
                          onSelect={(data) => {
                            setOpen(false);
                            field.onChange(data);
                          }}
                          fromYear={1960}
                          toYear={new Date().getFullYear()}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              // defaultValue={content.endDate && new Date(content.endDate)}
              control={workFormControl}
              name={`content.${index}.endDate`}
              render={({ field }) => {
                const [open, setOpen] = useState(false);
                return (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            disabled={isPresent}
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              <p>
                                {field.value.toLocaleDateString()}
                              </p>
                            ) : (
                              <span>Pick end date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          captionLayout="dropdown-buttons"
                          selected={field.value}
                          onSelect={(data) => {
                            setOpen(false);
                            field.onChange(data);
                          }}
                          fromYear={1960}
                          toYear={new Date().getFullYear()}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <FormField
            // defaultValue={isPresentDefault}
            control={workFormControl}
            name={`content.${index}.isEndPresent`}
            render={({ field }) => (
              <FormItem className="flex flex-row items-end space-x-2 mb-4">
                <FormControl>
                  <Checkbox
                    name={`content.${content._id}.isEndPresent`}
                    checked={field.value}
                    onCheckedChange={(e: any) => {
                      // setIsPresentWork((old) => !old);
                      field.onChange(e);
                    }}
                  />
                </FormControl>

                <FormLabel>This is my present work</FormLabel>
              </FormItem>
            )}
          />
          <div className="flex flex-row gap-3">
            <FormField
              // defaultValue={content.location || ""}
              control={workFormControl}
              name={`content.${index}.location`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="eg. Toronto, ON" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              // defaultValue={content.workType}
              control={workFormControl}
              name={`content.${index}.workType`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Work Type</FormLabel>
                  <Select
                    name={`content.${content._id}.workType`}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a work type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(workTypesNames).map((e, index) => (
                        <SelectItem key={index} value={e[0]}>
                          {e[1]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ContentForm;
