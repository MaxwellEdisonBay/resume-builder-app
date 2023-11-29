"use client"
import SectionsDragList from '@components/sections/Sections';
import { BaseSection } from '@models/domain/Section';
import { useState } from 'react';
import moment from 'moment'

const BuildResume = () => {
  const [submitting, setSubmitting] = useState(false)
  const a = moment()
  const [sections, setSections] = useState<BaseSection[]>(Array.from({ length: 10 }, (v, k) => k).map((k) => {
    const custom: BaseSection = {
      id: `id-${k}`,
      type: "work",
      title: `Resume Section ${k}`,
      content: [
        {
            id: "id-1",
            location: "Toronto, Canada",
            title: `Company 1 (${k})`,
            type:"remote",

            position: `Software Engineer 1 (${k})`,
            startDate: new Date(),
            endDate: new Date(),
            bullets: [
              "Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis, alias? Doloribus nesciunt error optio consequatur recusandae, quia, autem vero porro rerum soluta laborum commodi corporis quas similique pariatur quis reiciendis!",
              "Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis, alias? Doloribus nesciunt error optio consequatur recusandae, quia, autem vero porro rerum soluta laborum commodi corporis quas similique pariatur quis reiciendis!",
              "Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis, alias? Doloribus nesciunt error optio consequatur recusandae, quia, autem vero porro rerum soluta laborum commodi corporis quas similique pariatur quis reiciendis!",
            ]
        },
        {
            id: "id-2",
            title: `Company 2 (${k})`,
            location: "Toronto, Canada",
            type:"hybrid",

            position: `Software Engineer 2 (${k})`,
            bullets: [
              "Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis, alias? Doloribus nesciunt error optio consequatur recusandae, quia, autem vero porro rerum soluta laborum commodi corporis quas similique pariatur quis reiciendis!",
              "Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis, alias? Doloribus nesciunt error optio consequatur recusandae, quia, autem vero porro rerum soluta laborum commodi corporis quas similique pariatur quis reiciendis!",
              "Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis, alias? Doloribus nesciunt error optio consequatur recusandae, quia, autem vero porro rerum soluta laborum commodi corporis quas similique pariatur quis reiciendis!",
            ]
        },
        {
            id: "id-3",
            title: `Company 3 (${k})`,
            location: "Toronto, Canada",
            type:"full-time",
            position: `Software Engineer 3 (${k})`,
            bullets: [
              "Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis, alias? Doloribus nesciunt error optio consequatur recusandae, quia, autem vero porro rerum soluta laborum commodi corporis quas similique pariatur quis reiciendis!",
              "Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis, alias? Doloribus nesciunt error optio consequatur recusandae, quia, autem vero porro rerum soluta laborum commodi corporis quas similique pariatur quis reiciendis!",
              "Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis, alias? Doloribus nesciunt error optio consequatur recusandae, quia, autem vero porro rerum soluta laborum commodi corporis quas similique pariatur quis reiciendis!",
            ]
        }
      ]
    };
  
    return custom;
  }))
  const buildResume = async (e: any) => {

  }

  return (
    <div className='pb-10'><SectionsDragList sections={sections} setSections={setSections}/></div>
  )
}

export default BuildResume