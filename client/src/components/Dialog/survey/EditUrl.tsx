import { Dialog, DialogPanel } from "@headlessui/react";
import React, { useEffect, useState } from "react";
import { useUpdateSurveyUrl } from "../../../hooks/survey";
import { useLanguage } from "../../lang/LanguageProvider";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";

interface UpdateSurveyTitleDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditUrlDialog: React.FC<UpdateSurveyTitleDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t, getCurrentLanguageTranslations, getCurrentLanguage } =
    useLanguage();
  const currentSurveyState = useSelector(
    (state: RootState) => state.currentSurvey.currentSurvey
  );

  const [url, setUrl] = useState("");
  const [errors, setErros] = useState<Record<string, string> | null>(null);
  const { handleUpdateSurveyUrl, errorState, isSuccess } = useUpdateSurveyUrl();

  const handleSave = async (e: React.FormEvent) => {
    setErros(null);
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (url.trim().length === 0) {
        return;
      }
      await handleUpdateSurveyUrl({
        workspaceId: currentSurveyState!.workspace,
        surveyId: currentSurveyState!.id,
        url,
        getCurrentLanguageTranslations,
        currentLang: getCurrentLanguage(),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setUrl("");
      onClose();
    }
  }, [isSuccess]);

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div
        className="fixed inset-0 bg-black bg-opacity-30"
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="bg-[#1e1e1e] rounded-md py-5 w-[450px]">
          <div className="">
            <form onSubmit={handleSave} className="">
              <div className="flex w-full items-center border-b border-b-gray-500 pb-2 px-2">
                <button type="button" className="" onClick={onClose}>
                  <img
                    src="/assets/icons/close.svg"
                    alt="close"
                    className="w-[20px] h-[20px]"
                  />
                </button>
                <span className="flex flex-1 justify-center main_text_bold">
                  {t("customizeLink")}
                </span>
              </div>

              <div className="border-b border-b-gray-500 p-[2rem]">
                <input
                  type="text"
                  value={url}
                  placeholder={t("enterNameForSurveyLink")}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-[#2a2a2a] text-white border-none outline-none p-2 rounded-md"
                  disabled={isSubmitting}
                />
              </div>

              {((errorState && errorState.message) ||
                (errors && errors.url)) && (
                <div className="text-red-600 text-sm mt-2 px-4 text-center">
                  {errorState?.message || errors?.url}
                </div>
              )}

              <div className="flex justify-end gap-5 mt-4 px-4">
                <button
                  className=" bg-[#2f2b7226] py-2 px-4 rounded"
                  type="button"
                  onClick={() => {
                    onClose();
                    setUrl("");
                  }}
                >
                  {t("cancel")}
                </button>
                <button
                  disabled={isSubmitting}
                  className=" bg-[#2c2f31] transition-all  py-2 px-4 rounded"
                  type="submit"
                >
                  {t("save")}
                </button>
              </div>
            </form>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default EditUrlDialog;
