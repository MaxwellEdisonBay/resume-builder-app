"use client";
import { AddSectionDropdown } from "@components/sections/AddSectionDropdown";
import SectionsDragList from "@components/sections/Sections";
import TestComponent from "@components/sections/TestComponent";
import { Input } from "@components/ui/input";
import { BaseSection } from "@models/domain/Section";
import { showToast } from "@utils/toast";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const BuildResume = () => {
  const { data: session } = useSession();
  const [sections, setSections] = useState<BaseSection[]>([]);
  const fetchSections = async () => {
    try {
      const response = await fetch(`api/sections`);
      const sections: BaseSection[] = await response.json();
      setSections(sections);
    } catch (e) {
      const message =
        e instanceof Error
          ? e.message
          : "Exception occurred while loading sections";
      showToast({ message, type: "error" });
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const addSectionToCache = (newSection: BaseSection) => {
    setSections((oldSections) => [...oldSections, newSection])
  };

  return (
    <div className="flex flex-col gap-5 pb-10">
      <TestComponent/>
      {/* <Input/>
      <SectionsDragList sections={sections} setSections={setSections} />
      <AddSectionDropdown onSectionAdded={addSectionToCache} /> */}
    </div>
  );
};

export default BuildResume;
