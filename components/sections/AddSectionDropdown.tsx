"use client";
import {
  Briefcase,
  FilePlus2,
  Folder,
  GraduationCap,
  Lightbulb,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BaseSection, SectionTypes } from "@models/domain/Section";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { showToast } from "@utils/toast";
import toast from "react-hot-toast";

export function AddSectionDropdown({
  onSectionAdded,
}: {
  onSectionAdded: (newSection: BaseSection) => void;
}) {
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const onAddSection = async (sectionType: SectionTypes) => {
    if (session?.user.id) {
      setLoading(true);

      try {
        const newSectionData: BaseSection = {
          userId: session?.user.id,
          title: "",
          type: sectionType,
          content: [],
        };
        const response = await fetch(`api/sections`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newSectionData),
        });
        const newSection: BaseSection = await response.json();
        onSectionAdded(newSection);
        setLoading(false);
        toast.success("Added a new section successfully.");
      } catch (e) {
        console.log(e);
        toast.error("Could not add a new section. Exception occurred.");
        setLoading(false);
      }
    } else {
      toast.error("User should be logged in to add sections!");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
        disabled={loading}
          onClick={() => {}}
          className="max-w-fit bg-green-600 hover:bg-green-700"
        >
          {loading ? (
            <Loader2 className="w-8 h-8 animate-spin" />
          ) : (
            <FilePlus2 className="w-8 h-8 pr-3" />
          )}{" "}
          Add Section
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[200px]">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => onAddSection("work")}>
            <Briefcase className="mr-2 h-4 w-4" />
            <span>Work Experience</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAddSection("education")}>
            <GraduationCap className="mr-2 h-4 w-4" />
            <span>Education</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAddSection("skills")}>
            <Lightbulb className="mr-2 h-4 w-4" />
            <span>Skills</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAddSection("projects")}>
            <Folder className="mr-2 h-4 w-4" />
            <span>Projects</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
