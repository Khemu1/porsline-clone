import { Link } from "react-router-dom";
import { servePath } from "../../utils";
import DescriptionPreivew from "../Dialog/survey/edit/preview/DescriptionPreivew";
import LabelPreivew from "../Dialog/survey/edit/preview/LabelPreivew";
import ShareSurvey from "../Dialog/survey/edit/preview/ShareSurvey";
import { useEffect } from "react";
import { useLanguage } from "../lang/LanguageProvider";

interface PreviewProps {
  imageUrl?: string;
  label?: string;
  description?: string;
  buttonText?: string;
  shareSurvey?: boolean;
  reloadOrRedirect?: boolean;
  autoReload?: boolean;
  reloadTimeInSeconds?: number;
  redirectToWhat?: string;
  anotherLink?: string;
  redirectUrl?: string;
}
const SurveyEndingPreview: React.FC<PreviewProps> = ({
  imageUrl,
  label,
  description,
  buttonText,
  shareSurvey,
  reloadOrRedirect,
  autoReload,
  reloadTimeInSeconds,
  redirectToWhat,
  anotherLink,
  redirectUrl,
}) => {
  const { t } = useLanguage();
  useEffect(() => {
    if (autoReload && reloadTimeInSeconds) {
      setTimeout(() => {
        window.location.reload();
      }, reloadTimeInSeconds * 1000);
    }
  }, [autoReload]);

  useEffect(() => {
    if (redirectUrl) {
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 1000);
    }
  }, [redirectUrl]);
  return (
    <div className="flex flex-col flex-grow h-full gap-5 relative main_text">
      <div
        className={`flex flex-col h-full flex-grow justify-center items-center overflow-scroll gap-3 `}
      >
        {imageUrl && (
          <div className={`mt-2 w-[500px]`}>
            <img
              src={servePath(imageUrl)}
              alt="Preview"
              className="w-full h-auto rounded"
            />
          </div>
        )}
        {label && <LabelPreivew label={label} />}
        {description && <DescriptionPreivew description={description} />}
        {reloadOrRedirect &&
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
        {reloadOrRedirect &&
          buttonText &&
          redirectToWhat &&
          redirectToWhat.toLowerCase() !== "another link" && (
            <button
              onClick={() => window.location.reload()}
              className="flex justify-center mt-2  bg-blue-700 p-2 rounded-md min-w-[100px] main_text_bold"
            >
              {buttonText}
            </button>
          )}
        {shareSurvey && <ShareSurvey />}
        {redirectUrl && !buttonText && (
          <div className="text-center flex flex-col gap-5 items-center text-xl main_text bg-[#1a1b1d] py-8 px-5 w-[430px] rounded-md">
            <p className="w-[250px] main_text_bold mb-4">
              {t("suervyEndingHeader")}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SurveyEndingPreview;
