import { Dialog } from "@headlessui/react";
import { useLanguage } from "../../lang/LanguageProvider";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { useDuplicateSurvey } from "../../../hooks/survey";
import { newSurveySchema, validateWithSchema } from "../../../utils/survey";

interface DuplicateSurveyDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const DuplicateSurveyDialog: React.FC<DuplicateSurveyDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const { t, getCurrentLanguageTranslations, getCurrentLanguage } =
    useLanguage();
  const workspaces = useSelector(
    (state: RootState) => state.workspace.workspaces
  );
  const currentSurvey = useSelector(
    (state: RootState) => state.currentSurvey.currentSurvey
  );
  const currentWorkspace = useSelector(
    (state: RootState) => state.currentWorkspace.currentWorkspace
  );
  const [surveyTitle, setSurveyTitle] = useState("");
  const [workspaceId, setWorkspaceId] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string> | null>(null);

  const { handleDuplicateSurvey, isError, errorState, isSuccess } =
    useDuplicateSurvey();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(null);

    try {
      newSurveySchema().parse({ title: surveyTitle });
      if (!workspaceId || typeof workspaceId !== "number" || workspaceId < 1) {
        setErrors({ chooseWorkspace: t("chooseWorkspace") });
        return;
      }
      const lang = getCurrentLanguageTranslations();

      await handleDuplicateSurvey({
        title: surveyTitle,
        workspaceId: currentWorkspace!.id,
        surveyId: currentSurvey!.id,
        targetWorkspaceId: workspaceId,
        getCurrentLanguageTranslations: () => lang,
        currentLang: getCurrentLanguage(),
      });
    } catch (error) {
      setErrors(validateWithSchema(error, getCurrentLanguage()));
      console.error("Failed to duplicate survey", error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
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
        <Dialog.Panel className="bg-[#1e1e1e] rounded-md py-5 w-[300px]">
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
                {t("duplicate")}
              </span>
            </div>

            <div className="border-b border-b-gray-500 p-[2rem]">
              <input
                type="text"
                value={surveyTitle}
                placeholder={t("enterName")}
                onChange={(e) => setSurveyTitle(e.target.value)}
                className="w-full bg-[#2a2a2a] text-white border-none outline-none p-2 rounded-md"
              />
              {((isError && errorState?.title) || (errors && errors.title)) && (
                <div className="text-red-600 text-sm mt-2 px-4 text-center">
                  {errorState?.title || errors?.title || t("unknownError")}
                </div>
              )}
            </div>

            <div className="border-b border-b-gray-500 p-[2rem]">
              <select
                value={workspaceId ?? ""}
                onChange={(e) => setWorkspaceId(Number(e.target.value))}
                className="w-full bg-[#2a2a2a] text-white border-none outline-none p-2 rounded-md"
              >
                <option value="" disabled>
                  {t("selectWorkSpace")}
                </option>
                {workspaces.map((workspace) => (
                  <option key={workspace.id} value={workspace.id}>
                    {workspace.title}
                  </option>
                ))}
              </select>
              {((isError && errorState) ||
                (errors && errors.chooseWorkspace)) && (
                <div className="text-red-600 text-sm mt-2 px-4 text-center">
                  {errorState?.message ||
                    errors?.chooseWorkspace ||
                    t("unknownError")}
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
                {t("duplicate")}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default DuplicateSurveyDialog;
