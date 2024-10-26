import { servePath } from "../../utils";
import DescriptionPreivew from "../Dialog/survey/edit/preview/DescriptionPreivew";
import HideQuestionNumber from "../Dialog/survey/edit/preview/HideQuestionNumber";
import IsRequred from "../Dialog/survey/edit/preview/IsRequred";
import LabelPreivew from "../Dialog/survey/edit/preview/LabelPreivew";
import MaxMinPreview from "../Dialog/survey/edit/preview/MaxMinPreview";
import RegexPatternPreview from "../Dialog/survey/edit/preview/RegexPatternPreview";

interface PreviewProps {
  imageUrl?: string;
  label?: string;
  description?: string;
  min?: number;
  max?: number;
  answerFormat?: string;
  redirectUrl?: string;
  regex?: string;
  regexPlaceHolder?: string;
  regexErrorMessage?: string;
  isRequired?: boolean;
  hideQuestionNumber?: boolean;
  index: number;
  preview?: boolean;
  savedResponse?: string;
  onResponseChange: (value: string) => void;
}

const PreviewQuestion: React.FC<PreviewProps> = ({
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
  index,
  preview,
  savedResponse,
  onResponseChange,
}) => {
  return (
    <div className="flex  flex-col w-full gap-5 relative main_text overflow-hidden">
      <div className="mt-2 flex">
        {isRequired && <IsRequred />}
        {!hideQuestionNumber && <HideQuestionNumber index={index} />}
        {label && <LabelPreivew preview={preview} label={label} />}
      </div>

      {description && (
        <DescriptionPreivew preview={preview} description={description} />
      )}

      {imageUrl && (
        <div className={`mt-2 w-[500px]`}>
          <img
            src={servePath(imageUrl)}
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
              savedResponse={savedResponse}
              onResponseChange={onResponseChange}
            />
          )}
        {answerFormat?.toLowerCase() === "regex" && regex && (
          <RegexPatternPreview
            regxPattern={regex}
            isRequired={isRequired ?? false}
            placeholder={regexPlaceHolder}
            errorMessage={regexErrorMessage ?? ""}
            savedResponse={savedResponse}
            onResponseChange={onResponseChange}
          />
        )}
      </div>
    </div>
  );
};

export default PreviewQuestion;
