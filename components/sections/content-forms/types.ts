import { Content } from "@models/domain/Content";
import { SectionTypes } from "@models/domain/Section";
import { SectionSchemas } from "@utils/inputSchemas";
import { Control, UseFormReturn, UseFormWatch } from "react-hook-form";
import { z } from "zod";

export interface BaseContentFormProps {
    content: Content;
    form: UseFormReturn<z.infer<SectionSchemas>, any>;
    formWatch: UseFormWatch<z.infer<SectionSchemas>>;
    formControl: Control<z.infer<SectionSchemas>, any>;
    index: number;
  }
  
  export interface ContentFormProps extends BaseContentFormProps {
    sectionType: SectionTypes;
  }