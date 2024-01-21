import { Skeleton } from "@components/ui/skeleton";
import React from "react";

const LoadingInput = ({ numLines }: { numLines?: number }) => {
  const lines = numLines || 0;
  return (
    <div className="flex flex-col gap-2">
      {lines > 1 && (
        <div className="w-2/3">
          <Skeleton className="w-full h-7" />
        </div>
      )}
      <div className="w-full">
        <Skeleton className="w-full h-10" />
      </div>
    </div>
  );
};

export default LoadingInput;
