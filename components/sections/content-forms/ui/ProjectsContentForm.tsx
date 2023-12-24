"use client";
import { Button } from "@components/ui/button";
import { Calendar } from "@components/ui/calendar";
import { Card } from "@components/ui/card";
import { Checkbox } from "@components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { cn } from "@lib/utils";
import { workTypesNames } from "@models/domain/Content";
import { ProjectsFormSchema, WorkFormSchema } from "@utils/inputSchemas";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Control } from "react-hook-form";
import { z } from "zod";
import Bullets from "../../Bullets";
import { BaseContentFormProps } from "../types";

export const ProjectsContentForm = ({
  content,
  formControl,
  formWatch,
  index,
  form,
}: BaseContentFormProps) => {
  const projectsFormControl = formControl as unknown as Control<
    z.infer<typeof ProjectsFormSchema>,
    any
  >;
  const isPresent = form.watch(`content.${index}.isEndPresent`);

  useEffect(() => {
    if (isPresent) {
      form.setValue(`content.${index}.endDate`, undefined);
    }
  }, [isPresent]);

  return (
    <Card className="w-full">
      <div className=" flex flex-row gap-4 p-5 flex-wrap justify-between">
        <div className="flex flex-col gap-4">
          <FormField
            control={projectsFormControl}
            name={`content.${index}.title`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="eg. Task App"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-row flex-wrap gap-3">
          <FormField
              control={projectsFormControl}
              name={`content.${index}.websiteUrl`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="eg. https://my-website"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          <FormField
              control={projectsFormControl}
              name={`content.${index}.githubUrl`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Github</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="eg. https://github.com/my-profile"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
            
        </div>
        <div className="flex flex-col pt-2">
          <div className="flex flex-row gap-3 mb-2 flex-wrap">
            <FormField
              control={projectsFormControl}
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
                              <p>{field.value.toLocaleDateString()}</p>
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
              control={projectsFormControl}
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
                              <p>{field.value.toLocaleDateString()}</p>
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
            control={projectsFormControl}
            name={`content.${index}.isEndPresent`}
            render={({ field }) => (
              <FormItem className="flex flex-row items-end space-x-2 mb-4">
                <FormControl>
                  <Checkbox
                    name={`content.${content._id}.isEndPresent`}
                    checked={field.value}
                    onCheckedChange={(e: any) => {
                      field.onChange(e);
                    }}
                  />
                </FormControl>

                <FormLabel>The project is still in progress</FormLabel>
              </FormItem>
            )}
          />
          <div className="flex flex-row gap-3">
            
          </div>
        </div>
      </div>
      <Bullets contentIndex={index} formControl={formControl} />
    </Card>
  );
};
