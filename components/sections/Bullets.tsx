import { Button } from "@components/ui/button";
import { Card } from "@components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@components/ui/form";
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "@hello-pangea/dnd";
import { Bullet } from "@models/domain/Content";
import { SectionSchemas } from "@utils/inputSchemas";
import { Crown, GripHorizontal, XCircle } from "lucide-react";
import mongoose from "mongoose";
import React from "react";
import { Control, useFieldArray } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { z } from "zod";

export interface BulletsProps {
  formControl: Control<z.infer<SectionSchemas>, any>;
  contentIndex: number;
}

const Bullets = ({ contentIndex, formControl }: BulletsProps) => {
  const {
    fields: bullets,
    append,
    remove,
    move,
  } = useFieldArray({
    name: `content.${contentIndex}.bullets`,
    control: formControl,
  });
  const isNotLastBullet = bullets.length > 1;
  const handleRemove = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number
  ) => {
    e.preventDefault();
    remove(index);
  };
  const handleAdd = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const newBullet: Bullet = {
      _id: new mongoose.Types.ObjectId().toString(),
      text: "",
    };
    append(newBullet);
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

  return (
    <div className="flex flex-col w-full px-5 pb-3">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="innerLevelDroppable">
          {(provided, snapshot) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {bullets.map((bullet, index) => (
                <Draggable
                  isDragDisabled={!isNotLastBullet}
                  key={bullet._id}
                  draggableId={bullet._id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <Card
                      className="w-full flex flex-row  justify-start mb-3 items-stretch"
                      {...provided.draggableProps}
                      ref={provided.innerRef}
                    >
                      <div
                        {...provided.dragHandleProps}
                        className="flex items-center pl-3"
                      >
                        <GripHorizontal className="w-4 h-4 mr-3 text-slate-500" />
                      </div>
                      <div className="flex flex-row py-3 w-full">
                        <FormField
                          // defaultValue={content.location || ""}

                          control={formControl}
                          name={`content.${contentIndex}.bullets.${index}.text`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              {/* <FormLabel>Bullet Text</FormLabel> */}
                              <FormControl>
                                <TextareaAutosize
                                  maxLength={250}
                                  {...field}
                                  className="resize-none block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                  placeholder="eg. Implemented a new feature that resulted in 10% increase..."
                                  minRows={1}
                                  maxRows={3}
                                  value={field.value || ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          className="text-red-500 hover:text-red-600"
                          variant="ghost"
                          size="icon"
                          onClick={(e) => handleRemove(e, index)}
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        <Button
          variant="ghost"
          type="button"
          onClick={handleAdd}
          className="w-fit text-yellow-600 hover:text-yellow-700"
        >
          <Crown className="w-4 h-4 mr-2" />
          Add Bullet
        </Button>
      </DragDropContext>
    </div>
  );
};

export default Bullets;
