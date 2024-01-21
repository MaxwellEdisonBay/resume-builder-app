"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const AddResumeFormSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(100, { message: "Name cannot be longer than 100 characters!" })
    .trim(),
});

export interface CreateResumeDialogProps {
  open: boolean;
  close: () => void;
  onCreateResume: (name: string) => void;
}

const CreateResumeDialog = ({
  open,
  close,
  onCreateResume,
}: CreateResumeDialogProps) => {
  const form = useForm<z.infer<typeof AddResumeFormSchema>>({
    resolver: zodResolver(AddResumeFormSchema),
    defaultValues: {
      title: "",
    },
  });
  const onOpenChange = () => {
    close();
    if (open) {
      form.reset();
    }
  };
  function onSubmit(data: z.infer<typeof AddResumeFormSchema>) {
    form.reset();
    close();
    onCreateResume(data.title);
  }
  return (
    <Form {...form}>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px] ">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Create a Resume</DialogTitle>
              <DialogDescription>
                Please, fill in the resume title so you can find it here later.
              </DialogDescription>
            </DialogHeader>
            <div className="flex">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="eg. My Company Resume..."
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Form>
  );
};

export default CreateResumeDialog;
