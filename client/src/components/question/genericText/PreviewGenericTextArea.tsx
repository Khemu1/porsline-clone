import React, {  useState } from "react";
import { useLanguage } from "../../lang/LanguageProvider";

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
}) => {
  const { t } = useLanguage();

  const [validationError, setValidationError] = useState<Record<
    string,
    string
  > | null>(null);
  const [res, setRes] = useState<"pc" | "mobile">("pc");

  const validateMinMax = (
    minValue: number | undefined,
    maxValue: number | undefined,
    value: string
  ) => {
    let errors = {};
    if (regex !== undefined) {
      setValidationError(null);
      return;
    }
    if (
      maxValue === undefined ||
      minValue === undefined ||
      value.trim().length === 0
    ) {
      return;
    }
    if (value.length < minValue || value.length > maxValue) {
      const error = t("MinMax");
      const modifiedError = error
        .replace("{min}", minValue.toString())
        .replace("{max}", maxValue.toString());
      errors = { minMax: modifiedError };
    }
    if (Object.keys(errors).length > 0) {
      console.log(errors);
      setValidationError(errors);
      return;
    }
    setValidationError(null);
  };

  const validateRegex = (value: string, regexValue: string | undefined) => {
    if (regexValue !== undefined) {
      const regexExp = new RegExp(regexValue);
      if (!regexExp.test(value)) {
        setValidationError({
          regex: regexErrorMessage ?? "",
        });
        return;
      }
      setValidationError(null);
    }
  };

  return (
    <div className="flex flex-col  w-full h-full gap-5 relative main_text">
      {/* Buttons container */}
      <div className="flex gap-2 absolute top-5 left-1/2  mx-auto h-max z-10 bg-black">
        <button
          className={`flex-1 h-full p-1 ${
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
        className={`flex flex-col items-start h-full flex-grow justify-center px-8 bg-[#0000003b] overflow-scroll text-xl ${
          res === "pc" ? "pc_res" : "mobile_res mx-auto"
        }`}
      >
        {label && (
          <div className="mt-2 flex">
            <span className="text-blue-400 text-sm flex items-start">
              {isRequired ? "★" : ""}
            </span>
            <span className="">{hideQuestionNumber ? "" : "1-"}</span>
            {label}
          </div>
        )}
        {description && <p className="mt-2">{description}</p>}
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
        <div className="w-[350px] flex flex-col gap-2">
          <input
            type="text"
            minLength={min}
            maxLength={max}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              validateMinMax(min, max, e.target.value);
              validateRegex(e.target.value, regex);
            }}
            placeholder={regex && regexPlaceHolder ? regexPlaceHolder : ""}
            required={isRequired}
            className={`bg-transparent  input_border mt-4 p-2 rounded ${
              validationError?.minMax ? "input_error_border" : ""
            }`}
          />
          {(validationError?.minMax || validationError?.regex) && (
            <p className="text-[#ff484f] font-semibold bg-[#4f000a] max-w-[350px] mt-2 py-1 px-2 rounded-md">
              {validationError.minMax ?? validationError.regex}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Preview;
