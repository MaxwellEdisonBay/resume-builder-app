"use client";
import Chips from "@components/sections/Chips";
import { Button } from "@components/ui/button";
import { Card } from "@components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import { getRndColorFromString, handleIgnoreEnter } from "@utils/formHelpers";
import { SkillsFormSchema } from "@utils/inputSchemas";
import { Lightbulb } from "lucide-react";
import mongoose from "mongoose";
import { Control, UseFormReturn, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { BaseContentFormProps } from "../types";

export const SkillsContentForm = ({
  content,
  formControl,
  formWatch,
  index,
  form,
}: BaseContentFormProps) => {
  const skillsFormControl = formControl as unknown as Control<
    z.infer<typeof SkillsFormSchema>,
    any
  >;
  const skillsForm = form as unknown as UseFormReturn<
    z.infer<typeof SkillsFormSchema>,
    any
  >;
  const addTagFieldName = `content.${index}.skillInput` as const;
  const skillInput = skillsForm.watch(addTagFieldName);
  const isInputCorrect = skillInput?.trim();

  const handleAddTag = (e: any) => {
    e.preventDefault();
    const s = skillsForm.getFieldState(addTagFieldName);
    console.log(s);
    if (!s.invalid) {
      prepend({
        _id: new mongoose.Types.ObjectId().toString(),
        text: skillInput || "Default tag",
      });
      skillsForm.resetField(addTagFieldName);
    }
  };

  const handleAddTagOnEnter = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (isInputCorrect) {
        prepend({
          _id: new mongoose.Types.ObjectId().toString(),
          text: skillInput || "Default tag",
        });
      }
      skillsForm.resetField(addTagFieldName);
    }
  };

  const {
    fields: bullets,
    append,
    prepend,
    remove,
    move,
  } = useFieldArray({
    name: `content.${index}.bullets`,
    control: formControl,
  });

  return (
    <Card className="w-full">
      <div className=" flex flex-row gap-4 p-5 flex-wrap justify-start items-end">
        <FormField
          control={skillsFormControl}
          name={`content.${index}.title`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Skills group title</FormLabel>
              <FormControl>
                <Input
                  placeholder="eg. Languages"
                  {...field}
                  onKeyDown={handleIgnoreEnter}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={skillsFormControl}
          name={`content.${index}.skillInput`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Add a skill</FormLabel>
              <FormControl>
                <Input
                  placeholder="eg. Java, Management"
                  {...field}
                  maxLength={50}
                  value={field.value || ""}
                  onKeyDown={handleAddTagOnEnter}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="button" disabled={!isInputCorrect} onClick={handleAddTag}>
          <Lightbulb className="w-4 h-4 mr-2" />
          Add skill
        </Button>
      </div>
      <Chips
        formControl={formControl}
        contentIndex={index}
        bullets={bullets}
        onMove={move}
        onRemove={remove}
        color={getRndColorFromString(content.title)}
      />
    </Card>
  );
};
