"use client"
import SectionsDragList from '@components/sections/Sections';
import { BaseSection } from '@models/domain/Section';
import { useState } from 'react';

const BuildResume = () => {
  const [submitting, setSubmitting] = useState(false)
  const [sections, setSections] = useState<BaseSection[]>(Array.from({ length: 10 }, (v, k) => k).map((k) => {
    const custom: BaseSection = {
      id: `id-${k}`,
      type: "work",
      title: `Resume Section ${k}`,
      content: [
        {
            id: "id-1",
            title: "Content 1",
            bullets: []
        },
        {
            id: "id-2",
            title: "Content 2",
            bullets: []
        },
        {
            id: "id-3",
            title: "Content 3",
            bullets: []
        }
      ]
    };
  
    return custom;
  }))
  const buildResume = async (e: any) => {

  }

  return (
    <div><SectionsDragList sections={sections} setSections={setSections}/></div>
  )
}

export default BuildResume