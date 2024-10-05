import { useDispatch, useSelector } from "react-redux";
import { closeDialog } from "../../store/slices/dialogSlice";
import { RootState } from "../../store/store";
import { useState } from "react";
import { useUpdateSurvey } from "../../hooks/survey";
import { useLanguage } from "../lang/LanguageProvider";

const UpdateSurveyTitle = () => {
  const { t, getCurrentLanguageTranslations } = useLanguage();
  const dispatch = useDispatch();
  const currentSurveyState = useSelector(
    (state: RootState) => state.currentSurvey
  );
  const currentWorkspaceState = useSelector(
    (state: RootState) => state.currentWorkspace
  );

  const [title, setTitle] = useState("");
  const { handleUpdateSurvey, isError, errorState } = useUpdateSurvey();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const surveyId = currentSurveyState.currentSurvey?.id;
    const workspaceId = currentWorkspaceState.currentWorkspace?.id;
    if (!workspaceId || !surveyId) {
      dispatch(closeDialog());
      return;
    }
    if (surveyId) {
      handleUpdateSurvey({
        title,
        surveyId,
        workspaceId: workspaceId,
        getCurrentLanguageTranslations
      });
    }
  };

  return (
    <div>
      <form onSubmit={handleSave}>
        {" "}
        <div className="border-b border-b-gray-500 p-[2rem]">
          <input
            type="text"
            placeholder={currentSurveyState.currentSurvey?.title || "Asdasd"}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="py-[10px]"
          />
        </div>
        {isError && errorState && (
          <div className="text-red-600 text-sm mt-2">
            {errorState.message || "An error occurred."}
          </div>
        )}
        <div className="flex justify-end gap-5 mt-4 px-4">
          <button
            className="bg-gray-700 text-white py-2 px-4 rounded"
            type="button"
            onClick={() => dispatch(closeDialog())}
          >
            {t("cancel")}
          </button>
          <button
            className="bg-[#2f2b72] hover:bg-[#2a258a] transition-all text-white py-2 px-4 rounded"
            type="submit"
          >
            {t("save")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateSurveyTitle;
