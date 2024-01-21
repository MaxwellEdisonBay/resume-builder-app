"use client";
import { Button } from "@components/ui/button";
import { Calendar } from "@components/ui/calendar";
import { Card } from "@components/ui/card";
import { Checkbox } from "@components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@components/ui/command";
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
import { ScrollArea } from "@components/ui/scroll-area";
import { cn } from "@lib/utils";
import { EducationDegreeLevel } from "@models/api/ContentRs";
import { EducationFormSchema } from "@utils/inputSchemas";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { Control, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { BaseContentFormProps } from "../types";
import { degrees } from "@utils/textUtils";

export const EducationContentForm = ({
  content,
  formControl,
  formWatch,
  index,
  form,
}: BaseContentFormProps) => {
  const educationFormControl = formControl as unknown as Control<
    z.infer<typeof EducationFormSchema>,
    any
  >;
  const educationForm = form as unknown as UseFormReturn<
    z.infer<typeof EducationFormSchema>,
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
            control={educationFormControl}
            name={`content.${index}.title`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>School name</FormLabel>
                <FormControl>
                  <Input placeholder="eg. Stanford University" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-row flex-wrap items-top gap-3">
            <FormField
              control={educationFormControl}
              name={`content.${index}.educationDegreeLevel`}
              render={({ field }) => {
                const [open, setOpen] = useState(false);
                return (
                  <FormItem className="flex flex-col">
                    <FormLabel className="pt-1.5 pb-1">
                      Level of education
                    </FormLabel>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-[200px] justify-between mt-4",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <p className=" truncate">
                              {field.value
                                ? degrees.find(
                                    (degree) => degree.value === field.value
                                  )?.label
                                : "Select degree"}
                            </p>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <ScrollArea className="rounded-md border h-[200px]">
                            <CommandInput placeholder="Search degree..." />
                            <CommandEmpty>No degree found.</CommandEmpty>
                            <CommandGroup className="">
                              {degrees.map((degree) => (
                                <CommandItem
                                  value={degree.label}
                                  key={degree.value}
                                  onSelect={() => {
                                    educationForm.setValue(
                                      `content.${index}.educationDegreeLevel`,
                                      degree.value
                                    );
                                    setOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      degree.value === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {degree.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </ScrollArea>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={educationFormControl}
              name={`content.${index}.educationGpa`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grade</FormLabel>
                  <FormControl>
                    <Input
                      className="w-[100px]"
                      placeholder="eg. 3.68/4"
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
              control={educationFormControl}
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
              control={educationFormControl}
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
            control={educationFormControl}
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

                <FormLabel>Currently enrolled</FormLabel>
              </FormItem>
            )}
          />

          <div className="flex flex-row gap-3 flex-wrap">
            <FormField
              control={educationFormControl}
              name={`content.${index}.educationMajorName`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Field of study</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="eg. Computer Science"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={educationFormControl}
              name={`content.${index}.location`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="eg. Toronto, ON"
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
      </div>
    </Card>
  );
};
