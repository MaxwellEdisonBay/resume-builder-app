import React from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";

export interface LargeIconCTAProps {
  loading: boolean;
  descText: string;
  buttonText?: string;
  imageSrc: string | StaticImport;
  onButtonClick?: () => void;
}

const LargeIconCTA = ({
  loading,
  descText,
  buttonText,
  imageSrc,
  onButtonClick,
}: LargeIconCTAProps) => {
  return (
    <div className="flex flex-col items-center">
      <Image
        className="w-3/4 h-3/4 sm:w-1/3 sm:h-1/3  md:w-1/4 md:h-1/4"
        priority
        draggable={false}
        src={imageSrc}
        alt={descText}
      />
      <h1 className="text-xl text-gray-600 sm:text-2xl max-w-2xl text-center">
        {descText}
      </h1>
      {buttonText && (
        <Button
          disabled={loading}
          onClick={onButtonClick}
          className="mt-3 w-fit bg-bluegreen-700 hover:bg-bluegreen-800 rounded-full"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {buttonText}
        </Button>
      )}
    </div>
  );
};

export default LargeIconCTA;
