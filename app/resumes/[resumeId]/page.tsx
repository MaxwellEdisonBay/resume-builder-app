"use client";
import SectionsComponent from "@components/sections/SectionsComponent";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { SectionRs, mapSectionRsToContent } from "@models/api/SectionsRs";
import { Section, SectionTypes } from "@models/domain/Section";
import { showToast } from "@utils/toast";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { saveAs } from "file-saver";

import ReactResizeDetector from "react-resize-detector";
import LargeIconCTA from "@components/LargeIconCTA";
import addSectionImage from "../../../public/assets/images/page-content/Writing.svg";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import {
  Briefcase,
  ChevronRight,
  Folder,
  GraduationCap,
  Lightbulb,
  ScanEye,
} from "lucide-react";
import mongoose from "mongoose";
import cloneDeep from "lodash.clonedeep";
import SectionCardSkeleton from "@components/sections/SectionCardSkeleton";
import Link from "next/link";

const BuildResume = ({ params }: { params: { resumeId: string } }) => {
  const { data: session } = useSession();
  const [sections, setSections] = useState<Section[]>();
  const [loading, setLoading] = useState(false);
  const fetchSections = async () => {
    try {
      setLoading(true);
      const url = `/api/sections?resumeId=${params.resumeId}`;
      console.log(url);

      const response = await fetch(url);
      const sectionsRs: SectionRs[] = await response.json();
      const sections = sectionsRs.map((s) => mapSectionRsToContent(s));
      setSections(sections);
    } catch (e) {
      const message =
        e instanceof Error
          ? e.message
          : "Exception occurred while loading sections";
      showToast({ message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const getDefaultSectionName = (type: SectionTypes) => {
    const defaultNames: Record<SectionTypes, string> = {
      work: "Work Experience",
      education: "Education",
      skills: "Skills",
      projects: "Projects",
    };
    return defaultNames[type];
  };

  const handleSectionAdd = (sectionType: SectionTypes) => {
    const newSection: Section = {
      userId: session?.user.id || "",
      resumeId: params.resumeId,
      _id: new mongoose.Types.ObjectId().toString(),
      type: sectionType,
      title: getDefaultSectionName(sectionType),
      newAdded: true,
      content: [
        {
          _id: new mongoose.Types.ObjectId().toString(),
          title: "",
        },
      ],
    };
    setSections((oldSections) => {
      const newSections = cloneDeep(oldSections);
      newSections?.push(newSection);
      return newSections;
    });
  };

  useEffect(() => {
    fetchSections();
  }, []);

  // const addSectionToCache = (newSection: Section) => {
  //   setSections((oldSections) => [...oldSections, newSection]);
  // };

  const typesList: Record<
    SectionTypes,
    { text: string; icon: React.ReactNode }
  > = {
    work: { text: "Work", icon: <GraduationCap className="h-7 w-7" /> },
    education: { text: "Education", icon: <Briefcase className="h-7 w-7" /> },
    skills: { text: "Skills", icon: <Folder className="h-7 w-7" /> },
    projects: { text: "Projects", icon: <Lightbulb className="h-7 w-7" /> },
  } as const;

  // const handleAddSection = async () => {};

  return sections ? (
    sections.length ? (
      <div className="flex flex-row">
        <div className="flex flex-col gap-5 pb-10 w-3/4">
          <Link className="self-end" href={`${params.resumeId}/preview`}>
            <Button className="w-fit rounded-full pr-2">
              Preview & Styling <ChevronRight />
            </Button>
          </Link>
          {session?.user.id && (
            <SectionsComponent
              resumeId={params.resumeId}
              userId={session?.user.id}
              sections={sections || []}
              setSections={setSections}
              handleSectionAdd={handleSectionAdd}
            />
          )}
        </div>
      </div>
    ) : (
      <div className="flex flex-col gap-3">
        <LargeIconCTA
          imageSrc={addSectionImage}
          descText="Start building your resume by adding some sections"
          loading={loading}
        />
        <div className="flex flex-row self-center gap-4 flex-wrap justify-center">
          {Object.entries(typesList).map(([key, val]) => (
            <Button
              key={val.text}
              variant="default"
              className="w-[100px] h-[100px] rounded-xl flex-col gap-1 bg-bluegreen-700 hover:bg-bluegreen-800"
              onClick={() => handleSectionAdd(key as SectionTypes)}
            >
              {val.icon}
              {val.text}
            </Button>
          ))}
        </div>
      </div>
    )
  ) : (
    <SectionCardSkeleton />
  );
};

export default BuildResume;
