import React, { useState } from "react";
import DescriptionPreivew from "../preview/DescriptionPreivew";
import LabelPreivew from "../preview/LabelPreivew";
import { servePath } from "../../../../../utils";

interface PreviewProps {
  imageUrl?: string;
  label?: string;
  description?: string;
  buttonText?: string;
}

const PreviewWelcomeArea: React.FC<PreviewProps> = ({
  imageUrl,
  label,
  description,
  buttonText,
}) => {
  const [res, setRes] = useState<"pc" | "mobile">("pc");

  return (
    <div className="flex flex-col w-full h-full gap-5 relative main_text">
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
        className={`flex flex-col h-full flex-grow justify-center items-center bg-[#0000003b] overflow-scroll ${
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
              src={servePath(imageUrl)}
              alt="Preview"
              className="w-full h-auto rounded"
            />
          </div>
        )}
        {label && <LabelPreivew label={label} />}
        {description && <DescriptionPreivew description={description} />}
        {buttonText && (
          <button className="mt-2  bg-blue-700 p-2 rounded-md min-w-[100px] main_text_bold">
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default PreviewWelcomeArea;
