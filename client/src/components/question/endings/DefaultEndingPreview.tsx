import React, { useState } from "react";
import ShareSurvey from "../preview/ShareSurvey";
import LabelPreivew from "../preview/LabelPreivew";
import DescriptionPreivew from "../preview/DescriptionPreivew";
import { formatTime } from "../../../utils";
import { Link } from "react-router-dom";

interface PreviewProps {
  imageUrl?: string;
  label?: string;
  description?: string;
  buttonText?: string;
  shareSurvey?: boolean;
  reloadOrRedirectButton?: boolean;
  autoReload?: boolean;
  reloadTimeInSeconds: number;
  redirectToWhat?: string;
  anotherLink?: string;
}
const DefaultEndingPreview: React.FC<PreviewProps> = ({
  imageUrl,
  label,
  description,
  buttonText,
  shareSurvey,
  reloadOrRedirectButton,
  autoReload,
  reloadTimeInSeconds,
  redirectToWhat,
  anotherLink,
}) => {
  const [res, setRes] = useState<"pc" | "mobile">("pc");

  return (
    <div className="flex flex-col flex-grow h-full gap-5 relative main_text">
      {/* Buttons container */}
      <div className="flex gap-2 absolute top-5 left-1/2  mx-auto h-max   z-10 bg-black">
        <button
          className={`flex-1 h-full p-1  ${
            res === "pc" ? "bg-gray-700" : "bg-transparent"
          } transition-all`}
          onClick={() => setRes("pc")}
        >
          <img
            src="/assets/icons/pc.svg"
            alt="PC"
            className="mx-auto w-[20px] h-[20px]"
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
            className="mx-auto w-[20px] h-[20px]"
          />
        </button>
      </div>

      {/* Preview Area */}
      <div
        className={`flex flex-col h-full flex-grow justify-center items-center bg-[#0000003b] overflow-scroll gap-3 ${
          res === "pc" ? "pc_res" : " mobile_res mx-auto"
        }`}
      >
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
        {label && <LabelPreivew label={label} />}
        {description && <DescriptionPreivew description={description} />}
        {reloadOrRedirectButton &&
          buttonText &&
          redirectToWhat &&
          redirectToWhat.toLowerCase() === "another link" &&
          anotherLink && (
            <Link
              target="_blank"
              to={anotherLink}
              className="flex justify-center mt-2  bg-blue-700 p-2 rounded-md min-w-[100px] main_text_bold"
            >
              {buttonText}
            </Link>
          )}
        {reloadOrRedirectButton &&
          buttonText &&
          redirectToWhat &&
          redirectToWhat.toLowerCase() !== "another link" && (
            <button className="flex justify-center mt-2  bg-blue-700 p-2 rounded-md min-w-[100px] main_text_bold">
              {buttonText}
            </button>
          )}
        {shareSurvey && <ShareSurvey />}
        {autoReload && (
          <span>{formatTime(reloadTimeInSeconds)} Auto reload in</span>
        )}
      </div>
    </div>
  );
};

export default DefaultEndingPreview;
