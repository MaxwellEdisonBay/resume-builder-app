import { cn } from "@lib/utils";
import React from "react";

export interface ServerSeparatorProps {
  className?: string;
  orientation?: "vertical" | "horizontal";
}

const ServerSeparator = ({ className, orientation }: ServerSeparatorProps) => {
  const c =
    orientation === "vertical"
      ? cn(className, "flex w-[1px] bg-gray-200")
      : cn(className, "flex h-[1px] bg-gray-200");
  return <div className={c} />;
};

export default ServerSeparator;
