"use client";
import SectionsComponent from "@components/sections/TestComponent";
import { Input } from "@components/ui/input";
import { Section } from "@models/domain/Section";
import { showToast } from "@utils/toast";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const BuildResume = () => {
  const { data: session } = useSession();
  const [sections, setSections] = useState<Section[]>([]);
  const fetchSections = async () => {
    try {
      const response = await fetch(`api/sections`);
      const sections: Section[] = await response.json();
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

  const addSectionToCache = (newSection: Section) => {
    setSections((oldSections) => [...oldSections, newSection]);
  };

  return (
    <div className="flex flex-col gap-5 pb-10">
      {session?.user.id && <SectionsComponent userId={session?.user.id} sections={sections} setSections={setSections} />}
      {/* <Input/>
      <SectionsDragList sections={sections} setSections={setSections} />
      <AddSectionDropdown onSectionAdded={addSectionToCache} /> */}
    </div>
  );
};

export default BuildResume;
