"use client";
import CreateResumeDialog from "@components/resumes/CreateResumeDialog";
import { Button } from "@components/ui/button";
import { Card, CardContent } from "@components/ui/card";
import { Resume } from "@models/domain/Resume";
import { showToast } from "@utils/toast";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import emptyResumesImage from "../../public/assets/images/page-content/Animal.svg";
import resumeCoverImage from "../../public/assets/images/page-content/Victory.svg";
import mongoose from "mongoose";
import {
  Download,
  FileEdit,
  Loader2,
  MoreVertical,
  Plus,
  Trash2,
} from "lucide-react";
import cloneDeep from "lodash.clonedeep";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BaseDeleteById } from "@models/domain/Section";
import { BaseErrorResponse } from "@models/dto/error";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ResumeCardSkeleton from "@components/resumes/ResumeCardSkeleton";
import LargeIconCTA from "@components/LargeIconCTA";

const ResumeListPage = () => {
  const [resumes, setResumes] = useState<Resume[]>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  console.log(resumes);
  const fetchResumes = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/resumes`);
      const resumesRs: Resume[] = await response.json();
      setResumes(resumesRs);
    } catch (e) {
      const message =
        e instanceof Error
          ? e.message
          : "Exception occurred while loading sections";
      showToast({ message, type: "error" });
    }
    setLoading(false);
  };

  const onOpenCreateClick = () => {
    setDialogOpen(true);
  };

  const onResumeClick = (resumeId: string) => {
    router.push(`/resumes/${resumeId}`);
  };

  const handleDeleteResume = async (id?: string) => {
    setLoading(true);
    try {
      const deleteId: BaseDeleteById = {
        id: id || "",
      };
      const response = await fetch(`/api/resumes`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deleteId),
      });
      if (response.ok) {
        setResumes((oldResumes) =>
          cloneDeep(oldResumes || []).filter((r) => r._id !== id)
        );
        showToast({
          message: "Resume was deleted successfully.",
          type: "success",
        });
      } else {
        const errorResponse: BaseErrorResponse = await response.json();
        showToast({ message: errorResponse.message, type: "error" });
      }
      setLoading(false);
    } catch (e) {
      const message =
        e instanceof Error
          ? e.message
          : "Exception occurred while creating a resume";
      showToast({ message, type: "error" });
      setLoading(false);
    }
  };

  const handleAddResume = async (name: string) => {
    // console.log({ name });
    setLoading(true);
    try {
      const newResume: Resume = {
        name,
        _id: new mongoose.Types.ObjectId().toString(),
        userId: session?.user.id || "",
        sections: [],
      };
      const response = await fetch(`/api/resumes`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newResume),
      });
      const resumeRs: Resume = await response.json();

      setResumes((oldResumes) => {
        const newResumes = cloneDeep(oldResumes);
        newResumes?.push(resumeRs);
        return newResumes;
      });
      // console.log({ resumeRs });
      setLoading(false);
    } catch (e) {
      const message =
        e instanceof Error
          ? e.message
          : "Exception occurred while creating a resume";
      showToast({ message, type: "error" });
      setLoading(false);
    }
  };
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<{
    open: boolean;
    id?: string;
  }>({ open: false });

  const DeleteResumeAlert = () => {
    return (
      <AlertDialog
        open={deleteDialogOpen.open}
        onOpenChange={(open) => setDeleteDialogOpen({ open: false })}
      >
        {/* <AlertDialogTrigger asChild>
          <Button variant="outline">Show Dialog</Button>
        </AlertDialogTrigger> */}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              resume and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDeleteResume(deleteDialogOpen.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  useEffect(() => {
    fetchResumes();
    // setLoading(true)
  }, []);

  return (
    <div className="flex flex-col w-full">
      {resumes ? (
        resumes.length ? (
          <div className="flex flex-col items-center sm:flex-row flex-wrap">
            {/* <Card >
        <CardHeader>
          <CardTitle>You have no resumes</CardTitle>
        </CardHeader>

        <CardContent>
          <Image
          className="w-[200px] h-[200px]"
            priority
            src={emptyResumesImage}
            alt="There's no resumes to display."
          />
        <CardDescription>Test</CardDescription>

        </CardContent>
      </Card> */}
            {resumes.map((r) => (
              <Link key={r._id} href={`/resumes/${r._id}`}>
                <Card className="cursor-pointer hover:border-gray-300 w-[200px] h-[250px] mr-3">
                  <CardContent className="pt-6 pl-5 pr-2 h-full">
                    <div className="flex flex-col items-center justify-between h-full">
                      <Image
                        className="max-w-[150px] max-h-[150px] mr-3"
                        priority
                        draggable={false}
                        src={resumeCoverImage}
                        alt="There's no resumes to display."
                      />
                      <div className="flex flex-row justify-between items-end w-full">
                        <div className="flex flex-col pb-1">
                          <p className="font-medium truncate max-w-[120px] break-words">
                            {r.name}
                          </p>
                          {r.updatedAt && (
                            <p className="text-gray-500 text-sm italic whitespace-normal break-words">
                              {new Date(r.updatedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              disabled={loading}
                              size="icon"
                              variant="ghost"
                              className="text-gray-500 hover:text-gray-700 rounded-full"
                            >
                              {loading ? (
                                <Loader2 className="animate-spin" />
                              ) : (
                                <MoreVertical />
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuLabel className="text-gray-700">
                              Resume Actions
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-gray-700 hover:text-gray-800 cursor-pointer"
                              onClick={(e) => {
                                // Prevents propagation to card Link
                                e.stopPropagation();
                                setDeleteDialogOpen({ open: true, id: r._id });
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-gray-700 hover:text-gray-800 cursor-pointer"
                              onClick={(e) => {
                                // Prevents propagation to card Link
                                e.stopPropagation();
                              }}
                            >
                              <FileEdit className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-gray-700 hover:text-gray-800 cursor-pointer"
                              onClick={(e) => {
                                // Prevents propagation to card Link
                                e.stopPropagation();
                              }}
                            >
                              <Download className="mr-2 h-4 w-4" />
                              <span>Download PDF</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
            <Button
              variant="outline"
              size="icon"
              className="w-12 h-12  rounded-full"
              onClick={onOpenCreateClick}
              disabled={loading}
            >
              {" "}
              <Plus className="text-gray-600 w-5 h-5" />
            </Button>
          </div>
        ) : (
          <LargeIconCTA
            imageSrc={emptyResumesImage}
            descText="Oops! It looks like you have no resumes."
            buttonText="Create a resume"
            loading={loading}
            onButtonClick={onOpenCreateClick}
          />
        )
      ) : (
        <ResumeCardSkeleton />
      )}
      <CreateResumeDialog
        open={dialogOpen}
        close={() => setDialogOpen(false)}
        onCreateResume={handleAddResume}
      />
      <DeleteResumeAlert />
    </div>
  );
};

export default ResumeListPage;
