import React from "react";
import DescriptionPreivew from "../Dialog/survey/edit/preview/DescriptionPreivew";
import LabelPreivew from "../Dialog/survey/edit/preview/LabelPreivew";
import { servePath } from "../../utils";

interface PreviewProps {
  imageUrl?: string;
  label?: string;
  description?: string;
  buttonText?: string;
  preview?: boolean;
  next: (value: React.SetStateAction<number>) => void;
}

const WelcomePartPreview: React.FC<PreviewProps> = ({
  imageUrl,
  label,
  description,
  buttonText,
  preview,
  next,
}) => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full gap-5 relative main_text">
      {imageUrl && (
        <div className={`mt-2 mx-auto w-[500px]`}>
          <img
            src={servePath(imageUrl)}
            alt="Preview"
            className="w-full h-auto rounded"
          />
        </div>
      )}
      {label && <LabelPreivew preview={preview} label={label} />}{" "}
      {/* Corrected component name */}
      {description && (
        <DescriptionPreivew preview={preview} description={description} />
      )}{" "}
      {/* Corrected component name */}
      {buttonText && (
        <button
          className="mt-2 bg-blue-700 p-2 rounded-md min-w-[100px] main_text_bold text-xl"
          onClick={() => next(1)}
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default WelcomePartPreview;
