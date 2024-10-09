import React, { useState } from "react";
import IsRequred from "../preview/IsRequred";
import LabelPreivew from "../preview/LabelPreivew";
import HideQuestionNumber from "../preview/HideQuestionNumber";
import MaxMinPreview from "../preview/MaxMinPreview";
import RegexPatternPreview from "../preview/RegexPatternPreview";
import DescriptionPreivew from "../preview/DescriptionPreivew";

interface PreviewProps {
  imageUrl?: string;
  label?: string;
  description?: string;
  min?: number;
  max?: number;
  answerFormat?: string;
  regex?: string;
  regexPlaceHolder?: string;
  regexErrorMessage?: string;
  isRequired?: boolean;
  hideQuestionNumber?: boolean;
}

const Preview: React.FC<PreviewProps> = ({
  imageUrl,
  label,
  description,
  isRequired,
  regex,
  max,
  min,
  hideQuestionNumber,
  regexErrorMessage,
  regexPlaceHolder,
  answerFormat,
}) => {
  const [res, setRes] = useState<"pc" | "mobile">("pc");

  return (
    <div className="flex  flex-col w-full h-full gap-5 relative main_text overflow-hidden">
      {/* Buttons container */}
      <div className="flex absolute left-1/2 top-5 transform -translate-x-1/2 gap-2 z-10 bg-black">
        <button
          className={`flex-1 h-full p-1 ${
            res === "pc" ? "bg-gray-700" : "bg-transparent"
          } transition-all`}
          onClick={() => setRes("pc")}
        >
          <img
            src="/assets/icons/pc.svg"
            alt="PC"
            className="mx-auto w-[30px] h-[30px]"
          />
        </button>
        <button
          className={`flex-1 h-full p-1 ${
            res === "mobile" ? "bg-gray-700" : "bg-transparent"
          } transition-all`}
          onClick={() => setRes("mobile")}
        >
          <img
            src="/assets/icons/mobile.svg"
            alt="Mobile"
            className="mx-auto w-[30px] h-[30px]"
          />
        </button>
      </div>

      <div
        className={`flex flex-col relative items-start h-full flex-grow justify-center px-8 bg-[#0000003b] text-xl ${
          res === "pc" ? "pc_res" : "mobile_res"
        }`}
      >
        <div className="flex absolute left-1/2 top-5 gap-2 mx-auto h-max z-10 bg-black">
          <button
            className={`flex-1 h-full p-1 ${
              res === "mobile" ? "bg-gray-700" : "bg-transparent"
            } transition-all`}
            onClick={() => setRes("mobile")}
          >
            <img
              src="/assets/icons/mobile.svg"
              alt="Mobile"
              className="mx-auto w-[30px] h-[30px]"
            />
          </button>
        </div>

        <div className="mt-2 flex">
          {isRequired && <IsRequred />}
          {hideQuestionNumber && <HideQuestionNumber index={5} />}
          {label && <LabelPreivew label={label} />}
        </div>

        {description && <DescriptionPreivew description={description} />}

        {imageUrl && (
          <div
            className={`mt-2 ${
              res === "pc" ? "w-[500px] h-[500px]" : "w-[300px] h-[300px]"
            }`}
          >
            <img
              src={imageUrl}
              alt="Preview"
              className="w-full h-auto rounded"
            />
          </div>
        )}

        <div className="w-full flex flex-col gap-2 overflow-hidden">
          {answerFormat?.toLowerCase() === "text" &&
            max !== undefined &&
            min !== undefined && (
              <MaxMinPreview
                max={max}
                min={min}
                isRequired={isRequired ?? false}
              />
            )}
          {answerFormat?.toLocaleLowerCase() === "custom pattern" && regex && (
            <RegexPatternPreview
              regxPattern={regex}
              isRequired={isRequired ?? false}
              placeholder={regexPlaceHolder}
              errorMessage={regexErrorMessage ?? ""}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Preview;
