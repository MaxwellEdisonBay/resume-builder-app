"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Alert, AlertDescription, AlertTitle } from "@components/ui/alert";
import { Button } from "@components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Skeleton } from "@components/ui/skeleton";
import { IUser } from "@models/domain/IUser";
import { showToast } from "@utils/toast";
import { Loader2, PencilRuler } from "lucide-react";
import { useEffect } from "react";
import LoadingInput from "./components/LoadingInput";

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

const profileFormSchema = z.object({
  firstName: z
    .string()
    .min(2, {
      message: "First name must be at least 2 characters.",
    })
    .max(30, {
      message: "First name must not be longer than 30 characters.",
    })
    .trim(),
  lastName: z
    .string()
    .min(2, {
      message: "First name must be at least 2 characters.",
    })
    .max(30, {
      message: "First name must not be longer than 30 characters.",
    })
    .trim(),
  displayEmail: z
    .string({
      required_error: "Please select an email to display.",
    })
    .email()
    .trim(),
  phone: z
    .string()
    .regex(phoneRegex, "Please, enter a valid phone number.")
    .optional()
    .or(z.literal("")),
  linkedinUrl: z
    .string()
    .url({ message: "Please enter a valid LinkedIn URL." })
    .optional()
    .or(z.literal("")),
  githubUrl: z
    .string()
    .url({ message: "Please enter a valid Github URL." })
    .optional()
    .or(z.literal("")),
  portfolioUrl: z
    .string()
    .url({ message: "Please enter a valid Portfolio URL." })
    .optional()
    .or(z.literal("")),
  location: z
    .string()
    .max(100, { message: "Location should not be longer than 100 characters." })
    .optional()
    .or(z.literal("")),
  // urls: z
  //   .array(
  //     z.object({
  //       value: z.string().url({ message: "Please enter a valid URL." }),
  //     })
  //   )
  //   .optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

const test: Record<keyof ProfileFormValues, keyof ProfileFormValues> = {
  firstName: "firstName",
  lastName: "lastName",
  displayEmail: "displayEmail",
  location: "location",
  phone: "phone",
  portfolioUrl: "portfolioUrl",
  linkedinUrl: "linkedinUrl",
  githubUrl: "githubUrl",
};

const profileFormAllEntries = Object.values(test);

// // This can come from your database or API.
// const defaultValues: Partial<ProfileFormValues> = {
//   bio: "I own a computer.",
//   urls: [
//     { value: "https://shadcn.com" },
//     { value: "http://twitter.com/shadcn" },
//   ],
// };

export interface ProfileFormProps {
  profileData?: IUser;
  loading: boolean;
  onUpdate: (data: ProfileFormValues) => void;
}

export function ProfileForm({
  profileData,
  loading,
  onUpdate,
}: ProfileFormProps) {
  // const [edit, setEdit] = useState(false);
  // console.log({ profileData });

  const defaultValues: ProfileFormValues = {
    firstName: profileData?.firstName || "",
    lastName: profileData?.lastName || "",
    displayEmail: profileData?.displayEmail || "",
    location: profileData?.location || "",
    phone: profileData?.phone || "",
    portfolioUrl: profileData?.portfolioUrl || "",
    linkedinUrl: profileData?.linkedinUrl || "",
    githubUrl: profileData?.githubUrl || "",
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [profileData]);

  const isFormDirty = form.formState.isDirty;

  const shouldShowAddMoreInfoAlert =
    profileData && !profileFormAllEntries.every((e) => !!profileData[e]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onUpdate)} className="space-y-8">
        {shouldShowAddMoreInfoAlert && (
          <Alert className="border-green-600 text-green-600 [&>svg]:text-green-600">
            <PencilRuler className=" h-4 w-4" />
            <AlertTitle>You are still missing some info!</AlertTitle>
            <AlertDescription>
              You can add more contact information to the top of your resume.
            </AlertDescription>
          </Alert>
        )}
        <div className="grid grid-cols-2 gap-3">
          <FormField
            // disabled={!edit}
            control={form.control}
            name="firstName"
            render={({ field }) => {
              // console.log({ field });
              return (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    {profileData ? (
                      <Input
                        placeholder="eg. Adam"
                        {...field}
                        // defaultValue={}
                      />
                    ) : (
                      <LoadingInput />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            // disabled={!edit}
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  {profileData ? (
                    <Input
                      placeholder="eg. Smith"
                      {...field}
                      // defaultValue={}
                    />
                  ) : (
                    <LoadingInput />
                  )}
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          // disabled={!edit}
          control={form.control}
          name="displayEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Email</FormLabel>
              <FormControl>
                {profileData ? (
                  <Input placeholder="eg. myemail@example.com" {...field} />
                ) : (
                  <LoadingInput />
                )}
              </FormControl>
              <FormDescription>
                This is your display email used as a contact on the resume
                header. Set to the account email by default.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-3">
          <FormField
            // disabled={!edit}
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  {profileData ? (
                    <Input placeholder="eg. +1-999-999-9999" {...field} />
                  ) : (
                    <LoadingInput />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            // disabled={!edit}
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  {profileData ? (
                    <Input placeholder="eg. Toronto, ON" {...field} />
                  ) : (
                    <LoadingInput />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          // disabled={!edit}
          control={form.control}
          name="linkedinUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LinkedIn Link</FormLabel>
              <FormControl>
                {profileData ? (
                  <Input
                    placeholder="eg. https://www.linkedin.com/in/my-linkedin"
                    {...field}
                  />
                ) : (
                  <LoadingInput />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          // disabled={!edit}
          control={form.control}
          name="portfolioUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Portfolio Link</FormLabel>
              <FormControl>
                {profileData ? (
                  <Input
                    placeholder="eg. https://my-portfolio.com"
                    {...field}
                  />
                ) : (
                  <LoadingInput />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          // disabled={!edit}
          control={form.control}
          name="githubUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Github Link</FormLabel>
              <FormControl>
                {profileData ? (
                  <Input
                    placeholder="eg. https://github.com/my-github-repo"
                    {...field}
                  />
                ) : (
                  <LoadingInput />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <FormField
          control={form.control}
          name="displayEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="m@example.com">m@example.com</SelectItem>
                  <SelectItem value="m@google.com">m@google.com</SelectItem>
                  <SelectItem value="m@support.com">m@support.com</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                You can manage verified email addresses in your{" "}
                <Link href="/examples/forms">email settings</Link>.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        {/* <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about yourself"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                You can <span>@mention</span> other users and organizations to
                link to them.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        {/* <div>
          {fields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`urls.${index}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(index !== 0 && "sr-only")}>
                    URLs
                  </FormLabel>
                  <FormDescription className={cn(index !== 0 && "sr-only")}>
                    Add links to your website, blog, or social media profiles.
                  </FormDescription>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => append({ value: "" })}
          >
            Add URL
          </Button>
        </div> */}
        {/* {edit ? ( */}
        <Button
          className="bg-green-600 hover:bg-green-700"
          disabled={!isFormDirty || loading}
          type="submit"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Update profile
        </Button>
        {/* ) : (
          <Button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setEdit(true);
            }}
          >
            Edit profile
          </Button>
        )} */}
      </form>
    </Form>
  );
}

export const ProfileFormLoading = () => {
  const InputSkeleton = ({ long }: { long?: boolean }) => (
    <div className="flex flex-col gap-2">
      <div className={long ? "w-1/3" : "w-2/3"}>
        <Skeleton className="w-full h-7" />
      </div>
      <div className="w-full">
        <Skeleton className="w-full h-10" />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <InputSkeleton />
        <InputSkeleton />
      </div>
      <InputSkeleton long />
      <div className="grid grid-cols-2 gap-3">
        <InputSkeleton />
        <InputSkeleton />
      </div>
    </div>
  );
};
