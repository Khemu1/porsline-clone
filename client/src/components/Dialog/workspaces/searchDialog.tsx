import { Dialog, DialogPanel } from "@headlessui/react";
import { useLanguage } from "../../lang/LanguageProvider";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { retrunSearchData } from "../../../utils";
import { setCurrentWorkspace } from "../../../store/slices/currentWorkspaceSlice";
import { setSurveys } from "../../../store/slices/surveySlice";
import { clearCurrentSurvey } from "../../../store/slices/currentSurveySlice";

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchDialog: React.FC<SearchDialogProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const allWorkspaces = useSelector(
    (state: RootState) => state.workspace.workspaces
  );

  const dispatch = useDispatch();

  const [title, setTitle] = useState("");

  const { workspaces, surveys } = title
    ? retrunSearchData(allWorkspaces, title)
    : { workspaces: [], surveys: [] };

  const setWorksapceAsCurrent = (title: string) => {
    const workspace = allWorkspaces.find(
      (workspace) => workspace.title === title
    );
    const surveys = workspace!.surveys || [];
    dispatch(setCurrentWorkspace(workspace!));
    dispatch(setSurveys(surveys));
    dispatch(clearCurrentSurvey());
    setTitle("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div
        className="fixed inset-0 bg-black bg-opacity-30"
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="bg-[#1e1e1e] rounded-md py-5 w-full h-full">
          <div>
            <form className="">
              <div className="flex gap-5 border-b border-b-gray-500 p-[2rem]">
                {/* Search bar input */}
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t("search")}
                  className="w-full bg-[#2a2a2a] text-white border-none outline-none p-2 rounded-md"
                />
                <button
                  className="bg-[#2f2b7226] py-2 px-4 rounded"
                  type="button"
                  onClick={() => {
                    onClose();
                    setTitle("");
                  }}
                >
                  {t("cancel")}
                </button>
              </div>

              {title && (
                <div className="mt-4  overflow-y-auto px-4 h-full">
                  <div className="flex flex-col border-b border-b-gray-500 pb-3 h-full">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {t("workspaces")}
                    </h3>
                    {workspaces.length ? (
                      workspaces.map((workspace, index) => (
                        <button
                          type="button"
                          key={index}
                          className="flex  p-2 cursor-pointer hover:bg-gray-700 rounded-md"
                          value={workspace}
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            setWorksapceAsCurrent(e.currentTarget.value);
                          }}
                        >
                          {workspace}
                        </button>
                      ))
                    ) : (
                      <div className="text-sm text-gray-400">
                        {t("noWorkspacesFound")}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 h-full">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {t("surveys")}
                    </h3>
                    {surveys.length ? (
                      surveys.map((survey, index) => (
                        <div
                          key={index}
                          className="p-2 cursor-pointer hover:bg-gray-700 rounded-md"
                          onClick={() => setTitle(survey.title)}
                        >
                          {survey.title}
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-400">
                        {t("noSurveysFound")}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </form>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default SearchDialog;
