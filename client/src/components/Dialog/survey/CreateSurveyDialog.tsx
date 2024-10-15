import { Dialog, DialogPanel } from "@headlessui/react";
import { useLanguage } from "../../lang/LanguageProvider";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { useCreateSurvey } from "../../../hooks/survey"; // Assuming you have this hook
import { newSurveySchema, validateWithSchema } from "../../../utils/survey";

interface CreateSurveyDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateSurveyDialog: React.FC<CreateSurveyDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const { t, getCurrentLanguageTranslations, getCurrentLanguage } =
    useLanguage();

  const currentWorkspace = useSelector(
    (state: RootState) => state.currentWorkspace.currentWorkspace
  );
  const [surveyTitle, setSurveyTitle] = useState("");
  const [errors, setErrors] = useState<Record<string, string> | null>(null);

  const { handleCreateSurvey, isError, errorState, isSuccess } =
    useCreateSurvey();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(null);

    try {
      newSurveySchema().parse({ title: surveyTitle });

      if (!currentWorkspace?.id) {
        setErrors({ chooseWorkspace: t("unknownError") });
        return;
      }

      const lang = getCurrentLanguageTranslations();

      await handleCreateSurvey({
        title: surveyTitle,
        workspaceId: currentWorkspace?.id,
        getCurrentLanguageTranslations: () => lang,
        currentLang: getCurrentLanguage(),
      });
    } catch (error) {
      setErrors(validateWithSchema(error, getCurrentLanguage()));
      console.error("Failed to create survey", error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setSurveyTitle("");
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
        <DialogPanel className="bg-[#1e1e1e] rounded-md py-5 w-[300px]">
          <form onSubmit={handleSave}>
            <div className="flex w-full items-center border-b border-b-gray-500 pb-2 px-2">
              <button type="button" onClick={onClose}>
                <img
                  src="/assets/icons/close.svg"
                  alt="close"
                  className="w-[20px] h-[20px]"
                />
              </button>
              <span className="flex flex-1 justify-center text-white">
                {t("createSurvey")}
              </span>
            </div>

            <div className="border-b border-b-gray-500 p-[2rem]">
              <input
                type="text"
                value={surveyTitle}
                placeholder={t("enterTitle")}
                onChange={(e) => setSurveyTitle(e.target.value)}
                className="w-full bg-[#2a2a2a] text-white border-none outline-none p-2 rounded-md"
              />
              {((isError && errorState?.title) || (errors && errors.title)) && (
                <div className="text-red-600 text-sm mt-2 px-4 text-center">
                  {errorState?.title || errors?.title || t("unknownError")}
                </div>
              )}
            </div>

            {isError && errorState && (
              <div className="text-red-600 text-sm mt-2 px-4">
                {errorState.message || t("unknownError")}
              </div>
            )}

            <div className="flex justify-end gap-5 mt-4 px-4">
              <button
                className="bg-[#2f2b7226] py-2 px-4 rounded"
                type="button"
                onClick={onClose}
              >
                {t("cancel")}
              </button>
              <button
                className="bg-[#2c2f31] transition-all py-2 px-4 rounded"
                type="submit"
              >
                {t("save")}
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default CreateSurveyDialog;
