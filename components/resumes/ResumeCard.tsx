"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@components/ui/alert-dialog";
import { Button } from "@components/ui/button";
import { Card, CardContent } from "@components/ui/card";
import { IResume } from "@models/domain/IResume";
import { BaseErrorResponse } from "@models/dto/error";
import { showToast } from "@utils/toast";
import { saveAs } from "file-saver";
import {
  Download,
  FileEdit,
  Loader2,
  MoreVertical,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import resumeCoverImage from "../../public/assets/images/page-content/Victory.svg";

export interface ResumeCardProps {
  resume: IResume;
  onUpdateCacheAfterDelete: () => void;
}

const ResumeCard = ({ resume, onUpdateCacheAfterDelete }: ResumeCardProps) => {
  {
    const [cardLoading, setCardLoading] = useState(false);
    // const [deleteDialogOpen, setDeleteDialogOpen] = useState<{
    //     open: boolean;
    //     id?: string;
    //   }>({ open: false });

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const handleDeleteResume = async () => {
      setCardLoading(true);
      try {
        const response = await fetch(`/api/resumes/${resume._id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          onUpdateCacheAfterDelete();
          showToast({
            message: "Resume was deleted successfully.",
            type: "success",
          });
        } else {
          const errorResponse: BaseErrorResponse = await response.json();
          showToast({
            message: errorResponse.message,
            type: "error",
          });
        }
      } catch (e) {
        const message =
          e instanceof Error
            ? e.message
            : "Exception occurred while creating a resume";
        showToast({ message, type: "error" });
      } finally {
        setCardLoading(false);
      }
    };

    const handleDownloadResumePdf = async () => {
      try {
        setCardLoading(true);
        const response = await fetch(`/api/resumes/${resume._id}/downloads`);
        if (response.ok) {
          // console.log(await response.json())
          const blob = await response.blob();
          saveAs(blob, `${resume.name}.pdf`);
        } else {
          const errorRs: BaseErrorResponse = await response.json();
          showToast({ message: errorRs.message, type: "error" });
        }
      } catch (e) {
        const message =
          e instanceof Error
            ? e.message
            : "Exception occurred while loading sections";
        showToast({ message, type: "error" });
      } finally {
        setCardLoading(false);
      }
    };

    const DeleteResumeAlert = () => {
      return (
        <AlertDialog
          open={deleteDialogOpen}
          onOpenChange={(open) => setDeleteDialogOpen(false)}
        >
          {/* <AlertDialogTrigger asChild>
                  <Button variant="outline">Show Dialog</Button>
                </AlertDialogTrigger> */}
          <AlertDialogContent onClick={(e) => e.stopPropagation}>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                resume and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteResume();
                }}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    };

    return (
      <Link key={resume._id} href={`/resumes/${resume._id}`}>
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
                    {resume.name}
                  </p>
                  {resume.updatedAt && (
                    <p className="text-gray-500 text-sm italic whitespace-normal break-words">
                      {new Date(resume.updatedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      disabled={cardLoading}
                      size="icon"
                      variant="ghost"
                      className="text-gray-500 hover:text-gray-700 rounded-full"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {cardLoading ? (
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
                        setDeleteDialogOpen(true);
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
                      onClick={async (e) => {
                        // Prevents propagation to card Link

                        e.stopPropagation();
                        await handleDownloadResumePdf();
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
        <DeleteResumeAlert />
      </Link>
    );
  }
};

export default ResumeCard;
