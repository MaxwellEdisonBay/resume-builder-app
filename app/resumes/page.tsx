"use client";
import LargeIconCTA from "@components/LargeIconCTA";
import CreateResumeDialog from "@components/resumes/CreateResumeDialog";
import ResumeCard from "@components/resumes/ResumeCard";
import ResumeCardSkeleton from "@components/resumes/ResumeCardSkeleton";
import { Button } from "@components/ui/button";
import { Resume } from "@models/domain/Resume";
import { showToast } from "@utils/toast";
import cloneDeep from "lodash.clonedeep";
import { Plus } from "lucide-react";
import mongoose from "mongoose";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import emptyResumesImage from "../../public/assets/images/page-content/Animal.svg";

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
      showToast({
        message: `Resume ${name} was created successfully!`,
        type: "success",
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
              <ResumeCard
                key={r._id}
                resume={r}
                onUpdateCacheAfterDelete={() => {
                  setResumes((oldResumes) =>
                    cloneDeep(oldResumes || []).filter(
                      (olrResume) => olrResume._id !== r._id
                    )
                  );
                }}
              />
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
    </div>
  );
};

export default ResumeListPage;
