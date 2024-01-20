import { cn } from "@lib/utils";
import { SectionTypes } from "@models/domain/Section";
import { Briefcase, Folder, GraduationCap, Lightbulb } from "lucide-react";

export const SectionIcon = ({
  type,
  className,
}: {
  type: SectionTypes;
  className?: string;
}) => {
  const sectionIcons: Record<SectionTypes, React.ReactNode> = {
    education: <Briefcase className={cn(className, "h-5 w-5")} />,
    work: <GraduationCap className={cn(className, "h-5 w-5")} />,
    projects: <Folder className={cn(className, "h-5 w-5")} />,
    skills: <Lightbulb className={cn(className, "h-5 w-5")} />,
  } as const;
  return sectionIcons[type];
};
