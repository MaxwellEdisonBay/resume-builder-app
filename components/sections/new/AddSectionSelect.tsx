import { Button } from "@components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { SectionTypes } from "@models/domain/Section";
import { getDefaultSectionName } from "@utils/textUtils";
import {
  Briefcase,
  FilePlus2,
  Folder,
  GraduationCap,
  Lightbulb,
} from "lucide-react";
import React from "react";
import { SectionIcon } from "../SectionIcon";

export interface AddSectionSelectProps {
  sectionsTypesAvailable: SectionTypes[];
  onSectionSelect: (sectionType: SectionTypes) => void;
}

const AddSectionSelect = ({
  sectionsTypesAvailable,
  onSectionSelect,
}: AddSectionSelectProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="max-w-fit bg-green-600 hover:bg-green-700">
          <FilePlus2 className="w-8 h-8 pr-3" />
          Add Section
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[200px]">
        <DropdownMenuGroup>
          {sectionsTypesAvailable.map((t) => (
            <DropdownMenuItem key={t} onClick={() => onSectionSelect(t)}>
              <SectionIcon type={t} className="mr-2 h-4 w-4" />
              <span>{getDefaultSectionName(t)}</span>
            </DropdownMenuItem>
          ))}
          {/* <DropdownMenuItem onClick={() => onSectionSelect("work")}>
            <Briefcase className="mr-2 h-4 w-4" />
            <span>Work Experience</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSectionSelect("education")}>
            <GraduationCap className="mr-2 h-4 w-4" />
            <span>Education</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSectionSelect("skills")}>
            <Lightbulb className="mr-2 h-4 w-4" />
            <span>Skills</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSectionSelect("projects")}>
            <Folder className="mr-2 h-4 w-4" />
            <span>Projects</span>
          </DropdownMenuItem> */}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AddSectionSelect;
