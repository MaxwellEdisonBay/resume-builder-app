"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import cloneDeep from "lodash.clonedeep";
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "@hello-pangea/dnd";
// import { toast } from "@/components/ui/use-toast"

const testContentSchema = z.object({
  userId: z.string(),
  name: z.string(),
  experience: z.string(),
});

const FormSchema = z.object({
  professions: z.array(testContentSchema),
});
type Post = z.infer<typeof FormSchema>["professions"][number];
const postsDefault: Post[] = [
  { userId: "1_id", name: "Name 1", experience: "1" },
  { userId: "2_id", name: "Name 2", experience: "2" },
  { userId: "3_id", name: "Name 3", experience: "3" },
  { userId: "4_id", name: "Name 4", experience: "4" },
];

export function InputForm() {
  const [posts, setPosts] = useState(postsDefault);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      professions: posts,
    },
  });

  const { fields, append, remove, insert, swap, move } = useFieldArray({
    name: "professions",
    control: form.control,
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log({ data });
    // toast({
    //   title: "You submitted the following values:",
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // })
  }

  const onError = (e: any) => {
    console.log(e);
  };
  const onTest = (e: any) => {
    e.preventDefault();
    append({ userId: "newId", name: "New Name!", experience: "New Exp!" });
    // setFields((old) => {
    //     const newArr = cloneDeep(old)
    //     return newArr.reverse()
    //     // return shuffle(newArr)
    // })
  };

  function shuffle(array: any) {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex > 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

  const onDragEnd = (result: DropResult) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    const start = result.source.index;
    const destination = result?.destination?.index;
    console.log(start, destination);

    move(start, destination);
    //   const newField = cloneDeep(fields[start]);
    //   remove(start);
    //   insert(destination, newField);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="w-2/3 space-y-6"
      >
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="innerLevelDroppable">
            {(provided, snapshot) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {fields.map((value, index) => {
                  return (
                    <Draggable
                      key={value.id}
                      draggableId={value.userId}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          {...provided.dragHandleProps}
                          {...provided.draggableProps}
                          ref={provided.innerRef}
                          className="pb-3"
                        >
                          <FormField
                            control={form.control}
                            name={`professions.${index}.name`}
                            defaultValue={value.name}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="shadcn" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`professions.${index}.experience`}
                            defaultValue={value.experience + ""}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Experience</FormLabel>
                                <FormControl>
                                  <Input placeholder="shadcn" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        {/* {fields.map((value, i) => {
          return (
            <div className="" key={value.id}>
              <FormField
                control={form.control}
                name={`professions.${i}.name`}
                defaultValue={value.name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`professions.${i}.experience`}
                defaultValue={value.experience + ""}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience</FormLabel>
                    <FormControl>
                      <Input placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          );
        })} */}
        <Button onClick={onTest}>Test</Button>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
