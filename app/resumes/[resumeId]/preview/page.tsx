"use client";

import React, { useEffect, useRef, useState } from "react";
import { pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { ScrollArea } from "@components/ui/scroll-area";
import { Button } from "@components/ui/button";
import { showToast } from "@utils/toast";
import { Document, Page } from "react-pdf";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import Image from "next/image";
import { Separator } from "@components/ui/separator";
import { usePathname, useSearchParams } from "next/navigation";
import Lottie from "lottie-react";
import pdfLoadingAnimation from "@public/assets/animations/documentAnimation.json";
import { BaseErrorResponse } from "@models/dto/error";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

const ResumePreviewPage = ({ params }: { params: { resumeId: string } }) => {
  const [numPages, setNumPages] = useState<number>();
  const [pdfString, setPdfString] = useState("");
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }


  useEffect(() => {
    const fetchResumePdf = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/resumes/${params.resumeId}/downloads`);
        if (response.ok) {
          const blob = await response.blob();
          let reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            const base64String = reader.result ? (reader.result as string) : "";
            setPdfString(base64String.substring(base64String.indexOf(",") + 1));
            setLoading(false);
          };
        } else {
          const errorRs: BaseErrorResponse = await response.json()
          showToast({message: errorRs.message, type: "error"})
        }
        // console.log(await response.json())
        
      } catch (e) {
        const message =
          e instanceof Error
            ? e.message
            : "Exception occurred while loading sections";
        showToast({ message, type: "error" });
      }
    }
    fetchResumePdf()
  }, [])

  const onTest = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/resumes/${params.resumeId}/downloads`);
      // console.log(await response.json())
      const blob = await response.blob();
      let reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64String = reader.result ? (reader.result as string) : "";
        setPdfString(base64String.substring(base64String.indexOf(",") + 1));
        setLoading(false);
      };
    } catch (e) {
      const message =
        e instanceof Error
          ? e.message
          : "Exception occurred while loading sections";
      showToast({ message, type: "error" });
    }
  };

  const templateData = [
    {
      _id: "id1",
      name: "Template1",
      thubmnail:
        "https://fastly.picsum.photos/id/543/200/300.jpg?hmac=JHbKAeHI7u3kPoNG9pE9vFnF8ozQabbnwrDwHxdcqv4",
    },
    {
      _id: "id2",
      name: "Template2",
      thubmnail:
        "https://fastly.picsum.photos/id/543/200/300.jpg?hmac=JHbKAeHI7u3kPoNG9pE9vFnF8ozQabbnwrDwHxdcqv4",
    },
    {
      _id: "id3",
      name: "Template3",
      thubmnail:
        "https://fastly.picsum.photos/id/543/200/300.jpg?hmac=JHbKAeHI7u3kPoNG9pE9vFnF8ozQabbnwrDwHxdcqv4",
    },
    {
      _id: "id4",
      name: "Template4",
      thubmnail:
        "https://fastly.picsum.photos/id/543/200/300.jpg?hmac=JHbKAeHI7u3kPoNG9pE9vFnF8ozQabbnwrDwHxdcqv4",
    },
    {
      _id: "id5",
      name: "Template5",
      thubmnail:
        "https://fastly.picsum.photos/id/543/200/300.jpg?hmac=JHbKAeHI7u3kPoNG9pE9vFnF8ozQabbnwrDwHxdcqv4",
    },
    {
      _id: "id6",
      name: "Template6",
      thubmnail:
        "https://fastly.picsum.photos/id/543/200/300.jpg?hmac=JHbKAeHI7u3kPoNG9pE9vFnF8ozQabbnwrDwHxdcqv4",
    },
    {
      _id: "id7",
      name: "Template7",
      thubmnail:
        "https://fastly.picsum.photos/id/543/200/300.jpg?hmac=JHbKAeHI7u3kPoNG9pE9vFnF8ozQabbnwrDwHxdcqv4",
    },
  ];

  //   const { height, width } = useWindowDimensions();
  const selectedTemplateRef = useRef<HTMLHeadingElement>(null);

  const pdfPreviewRef = useRef<HTMLHeadingElement>(null);
  const [testWidth, setWidth] = useState(0);

  useEffect(() => {
    // when the component gets mounted
    if (pdfPreviewRef.current) {
      setWidth(pdfPreviewRef.current.offsetWidth);
    }
    // to handle page resize
    const getwidth = () => {
      if (pdfPreviewRef.current) {
        setWidth(pdfPreviewRef.current.offsetWidth);
      }
    };
    window.addEventListener("resize", getwidth);
    // remove the event listener before the component gets unmounted
    return () => window.removeEventListener("resize", getwidth);
  }, []);

  useEffect(() => {
    selectedTemplateRef?.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });
  }, []);

  return (
    <div className="flex flex-col">
      <div className="flex flex-row w-full gap-2">
        <div className="w-1/4">
          <ScrollArea className="h-[90vh] rounded-md gap-3">
            <div className="flex flex-col gap-3">
              {templateData.map((t) => (
                <Card
                  key={t.name}
                  ref={t._id === "id5" ? selectedTemplateRef : null}
                >
                  <CardHeader>{t.name}</CardHeader>
                  <CardContent>
                    <Image
                      className="w-[150px]"
                      width={100}
                      height={100}
                      src={t.thubmnail}
                      alt="Test"
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
        <div className="w-3/4" ref={pdfPreviewRef}>
          {pdfString ? (
            <Document
              className="justify-center w-full"
              file={`data:application/pdf;base64,${pdfString}`}
              onLoadSuccess={onDocumentLoadSuccess}
            >
              <ScrollArea className="rounded-md border justify-center h-[90vh] w-full">
                {Array.from(Array(numPages).keys()).map((num) => (
                  <div key={num}>
                    <Page
                      // scale={width / 1000}
                      width={testWidth}
                      className="flex justify-center"
                      // key={num}
                      pageNumber={num + 1}
                      // height={height}
                      // width={width/2}
                    />
                    <Separator />
                  </div>
                ))}
              </ScrollArea>
            </Document>
          ) : (
            <Card className="flex h-[90vh] w-full items-center justify-center">
              <CardContent>
                {loading && (
                  <div className="flex flex-col w-full justify-center items-center self-center">
                    <Lottie
                      animationData={pdfLoadingAnimation}
                      className="flex justify-center items-center"
                      loop={true}
                    />
                    <h1 className="text-xl text-gray-600 sm:text-2xl max-w-2xl text-center">
                      Rendering the resume...
                    </h1>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <div>ResumePreviewPage</div>

      <Button className="w-[100px]" onClick={onTest}>
        Test
      </Button>

      {/* {pdfString && (
        // <ReactResizeDetector handleHeight handleWidth>
        //   {({ width, height, targetRef }) => (
        //     <div ref={targetRef as React.LegacyRef<HTMLDivElement>}>
        
        //     </div>
        //   )}
        // </ReactResizeDetector>
      )} */}
    </div>
  );
};

export default ResumePreviewPage;
