"use client";
import SectionsComponent from "@components/sections/SectionsComponent";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { SectionRs, mapSectionRsToContent } from "@models/api/SectionsRs";
import { Section } from "@models/domain/Section";
import { showToast } from "@utils/toast";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { saveAs } from "file-saver";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { pdfjs } from "react-pdf";
import { ScrollArea } from "@components/ui/scroll-area";
import ReactResizeDetector from "react-resize-detector";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

const BuildResume = () => {
  const { data: session } = useSession();
  const [sections, setSections] = useState<Section[]>([]);
  const fetchSections = async () => {
    try {
      const response = await fetch(`api/sections`);
      const sectionsRs: SectionRs[] = await response.json();
      const sections = sectionsRs.map((s) => mapSectionRsToContent(s));
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

  const [numPages, setNumPages] = useState<number>();
  const [pdfString, setPdfString] = useState("");
  const [pageNumber, setPageNumber] = useState<number>(1);
  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  const onTest = async () => {
    try {
      const response = await fetch(`api/resume`);
      const blob = await response.blob();
      const filename = response.headers
        .get("Content-Disposition")
        ?.split("filename=")[1];
      let base64String: string;

      let reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        base64String = reader.result ? (reader.result as string) : "";
        setPdfString(base64String.substring(base64String.indexOf(",") + 1));
      };
      // saveAs(blob, filename || "Resume.pdf")
      // const sectionsRs = await response.json();
      console.log(response.headers);
    } catch (e) {
      const message =
        e instanceof Error
          ? e.message
          : "Exception occurred while loading sections";
      showToast({ message, type: "error" });
    }
  };

  return (
    <div className="flex flex-row">
      <div className="flex flex-col gap-5 pb-10 w-3/4">
        <Button className="w-[100px]" onClick={onTest}>
          Test
        </Button>
        {session?.user.id && (
          <SectionsComponent
            userId={session?.user.id}
            sections={sections}
            setSections={setSections}
          />
        )}
        {/* <InputForm/> */}
        {/* <Input/>
<SectionsDragList sections={sections} setSections={setSections} />
<AddSectionDropdown onSectionAdded={addSectionToCache} /> */}
      </div>
      <div className="flex w-1/4">
        {pdfString && (
          // <ReactResizeDetector handleHeight handleWidth>
          //   {({ width, height, targetRef }) => (
          //     <div ref={targetRef as React.LegacyRef<HTMLDivElement>}>
                <Document
                  className="justify-center"
                  file={`data:application/pdf;base64,${pdfString}`}
                  onLoadSuccess={onDocumentLoadSuccess}
                >
                  <ScrollArea className="rounded-md border justify-center h-screen">
                    {Array.from(Array(numPages).keys()).map((num) => (
                      <Page
                        key={num}
                        pageNumber={num + 1}
                        // height={height}
                        // width={width/2}
                      />
                    ))}
                  </ScrollArea>
                </Document>
          //     </div>
          //   )}
          // </ReactResizeDetector>
        )}
      </div>
    </div>
  );
};

export default BuildResume;
