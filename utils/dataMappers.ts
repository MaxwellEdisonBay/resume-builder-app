import { z } from "zod";
import { getSectionSchema, WorkFormSchema } from './inputSchemas';
import { Section } from "@models/domain/Section";
import { Content, WorkTypes } from "@models/domain/Content";

export const mapFormDataToContent = (data: z.infer<ReturnType<typeof getSectionSchema>>, oldSectionCopy: Section) => {
    switch (oldSectionCopy.type) {
        case "work": 
            const workSchema = data as z.infer<typeof WorkFormSchema>
            oldSectionCopy.title = workSchema.title
            const test = Object.entries(workSchema.content)
            const newCont = test.map(([id, c]) => {
                const updatedContent: Content = {
                    _id: id,
                    title: c.title,
                    startDate: c.startDate,
                    endDate: c.isEndPresent ? undefined : c.endDate,
                    location: c.location,
                    position: c.position,
                    workType: c.workType as WorkTypes
                }
                return updatedContent
            })
            oldSectionCopy.content = newCont
            break
        case "education": break
        case "projects" : break
        case "skills" : break
     }
}