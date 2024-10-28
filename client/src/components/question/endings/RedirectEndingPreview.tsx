import { useLanguage } from "../../lang/LanguageProvider";

const RedirectEndingPreview = () => {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col grow main_text justify-center items-center">
      <div className="flex items-center flex-col gap-5">
        <h2 className="main_text_bold text-xl">{t("redirectToUrl")}</h2>
        <p>{t("redirectEndingText")}</p>
      </div>
    </div>
  );
};

export default RedirectEndingPreview;
