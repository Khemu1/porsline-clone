import { Dialog, DialogPanel } from "@headlessui/react";

import { CustomEndingModel, DefaultEndingModel } from "../../../../../types";
import { useDispatch, useSelector } from "react-redux";
import { useLanguage } from "../../../../lang/LanguageProvider";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useEditEnding } from "../../../../../hooks/ending";
import { RootState } from "../../../../../store/store";
import {
  modifySharedFormSliceFields,
  setIsSubmitting,
} from "../../../../../store/slices/sharedFormSlice";
import {
  customEndingSchema,
  editDefaultEndingSchema,
} from "../../../../../utils/endings";
import { clearSlices, transformDataIntoFormData } from "../../../../../utils";
import { validateWithSchema } from "../../../../../utils/genericText";
import DefaultEndingPreview from "../../../../question/endings/DefaultEndingPreview";
import RedirectEndingPreview from "../preview/RedirectEndingPreview";
import EditDefaultEnding from "./EditDefaultEnding";
import EditRedirectEnding from "./EditRedirectEnding";
import { modifyDefaultEndingSliceFields } from "../../../../../store/slices/defaultEnding";
import { modifyRedirectEndingSliceFields } from "../../../../../store/slices/redirectEnding";

interface EndingsProps {
  isOpen: boolean;
  onClose: () => void;
  ending: CustomEndingModel | DefaultEndingModel;
}

const EditEndings: React.FC<EndingsProps> = ({ isOpen, onClose, ending }) => {
  const dispatch = useDispatch();
  const { t, getCurrentLanguage, getCurrentLanguageTranslations } =
    useLanguage();
  const [active, setActive] = useState<"default" | "custom">(
    ending.type ?? "default"
  );
  const [validationErrors, setValidationErrors] = useState<Record<
    string,
    string | undefined
  > | null>(null);
  const { workspaceId, surveyId } = useParams();
  const { handleEditEnding, isSuccess } = useEditEnding();

  const {
    isLabelEnabled,
    label,
    description,
    isImageUploadEnabled,
    isDescriptionEnabled,
    previewImageUrl,
    shareSurvey,
    defaultEnding,
    reloadOrRedirect,
    buttonText,
    anotherLink,
    autoReload,
    reloadTimeInSeconds,
    redirectToWhat,
    redirectUrl,
  } = useSelector((state: RootState) => ({
    isLabelEnabled: state.welcomePage.isLabelEnabled,
    label: state.sharedForm.label,
    description: state.sharedForm.description,
    isImageUploadEnabled: state.sharedForm.isImageUploadEnabled,
    isDescriptionEnabled: state.sharedForm.isDescriptionEnabled,
    previewImageUrl: state.sharedForm.previewImageUrl,
    shareSurvey: state.defaultEnding.shareSurvey,
    defaultEnding: state.sharedForm.defaultEnding,
    reloadOrRedirect: state.defaultEnding.reloadOrRedirect,
    buttonText: state.defaultEnding.buttonText,
    autoReload: state.defaultEnding.autoReload,
    reloadTimeInSeconds: state.defaultEnding.reloadTimeInSeconds,
    anotherLink: state.defaultEnding.anotherLink,
    redirectToWhat: state.defaultEnding.redirectToWhat,
    redirectUrl: state.redirectEnding.redirectUrl,
  }));
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      console.log("current ending", ending);
      e.preventDefault();
      setValidationErrors(null);
      setIsSubmitting(true);

      const formData = new FormData();
      const commonData = {
        workspaceId: +workspaceId!,
        surveyId: +surveyId!,
      };

      let schema, data;
      const currentEndingType = ending.type;

      if (!currentEndingType) {
        window.alert("Please select the type of ending first.");
        return;
      }

      const finalizeFormData = () => {
        transformDataIntoFormData(commonData, formData);
        formData.set("currentEndingType", currentEndingType);
      };

      if (active === "default") {
        const defaultEndingData = {
          label: label || null,
          description: isDescriptionEnabled ? description : null,
          imageUrl: isImageUploadEnabled ? previewImageUrl : null,
          shareSurvey: shareSurvey ?? null,
          buttonText: buttonText.trim() ? buttonText : null,
          anotherLink:
            reloadOrRedirect && redirectToWhat.toLowerCase() === "another link"
              ? anotherLink?.trim() || null
              : null,
          reloadTimeInSeconds:
            autoReload && reloadTimeInSeconds ? reloadTimeInSeconds : null,
          reloadOrRedirectButton: reloadOrRedirect ?? null,
          autoReload: autoReload ?? null,
          redirectToWhat: redirectToWhat?.trim() || null,
          defaultEnding: defaultEnding ?? null,
          reloadOrRedirect,
        };
        schema = editDefaultEndingSchema(
          isDescriptionEnabled,
          isImageUploadEnabled,
          shareSurvey,
          defaultEnding,
          reloadOrRedirect,
          autoReload
        );
        data = schema.parse(defaultEndingData);
        transformDataIntoFormData({ ...data, type: active }, formData);
      } else if (active === "custom") {
        const customEndingData = {
          redirectUrl: redirectUrl || null,
          label: label.trim() ? label : null,
          defaultEnding: defaultEnding ?? null,
        };

        schema = customEndingSchema(defaultEnding);
        data = schema.parse(customEndingData);
        transformDataIntoFormData(
          { ...data, type: active, currentEndingType },
          formData
        );
      }

      finalizeFormData();
      console.log(formData);
      await handleEditEnding({
        endingId: ending.id,
        endingData: formData,
        getCurrentLanguageTranslations,
        currentLang: getCurrentLanguage(),
      });
    } catch (error) {
      console.log(error);
      const validationErrors = validateWithSchema(error, getCurrentLanguage());
      setValidationErrors(validationErrors);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      clearSlices(dispatch);
      onClose();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (ending.type === "default") {
      dispatch(modifyDefaultEndingSliceFields(ending));
      dispatch(modifySharedFormSliceFields(ending));
    } else if (ending.type === "custom") {
      dispatch(modifyRedirectEndingSliceFields(ending));
      dispatch(modifySharedFormSliceFields(ending));
    }
  }, []);

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div
        className="fixed inset-0 bg-black bg-opacity-30"
        aria-hidden="true"
      />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="bg-[#1e1e1e] rounded-md w-full h-full flex flex-col">
          <div className="flex h-full overflow-y-auto">
            <form
              onSubmit={handleSave}
              className="flex flex-col gap-5 w-full h-full overflow-y-scroll md:w-1/4 border-r border-r-gray-600  pb-2 "
            >
              <div className="flex gap-5 items-center text-lg main_text_bold border-b border-b-[#85808025] p-4">
                <button type="button" onClick={onClose}>
                  <img
                    src="/assets/icons/close.svg"
                    alt="Close"
                    className="w-[30px] h-[30px]"
                  />
                </button>
                <span>{t("genericText")}</span>
              </div>

              <div className="px-4">
                <div className="flex justify-between overflow-hidden shrink-0 rounded-md text-sm w-full  border border-[#ffff] shadow-lg">
                  <button
                    type="button"
                    className={`flex justify-center items-center flex-1 p-1  ${
                      active === "default" ? "bg-[#242068]" : "bg-[#2420683a]"
                    }`}
                    onClick={() => {
                      setActive("default");
                      clearSlices(dispatch);
                    }}
                  >
                    {t("endings")}
                  </button>
                  <button
                    type="button"
                    className={`flex justify-center items-center flex-1 p-1  ${
                      active === "custom" ? "bg-[#242068]" : "bg-[#2420683a]"
                    }`}
                    onClick={() => {
                      setActive("custom");
                      clearSlices(dispatch);
                    }}
                  >
                    {t("redirectToURL")}
                  </button>
                </div>
              </div>

              {active === "default" && (
                <EditDefaultEnding validationErrors={validationErrors} />
              )}
              {active === "custom" && (
                <EditRedirectEnding validationErrors={validationErrors} />
              )}

              <div className="flex justify-start gap-5 items-center p-4 border-t border-t-[#85808025]">
                <button
                  disabled={!isLabelEnabled && !isDescriptionEnabled}
                  type="submit"
                  className={`${
                    !isLabelEnabled && !isDescriptionEnabled
                      ? "bg-[#0000001e]"
                      : "bg-[#2f2b72] "
                  } transition-all main_text_bold py-2 px-4 rounded`}
                >
                  {t("save")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    clearSlices(dispatch);
                  }}
                  className="bg-[#2f2b7226] main_text_bold py-2 px-4 rounded"
                >
                  {t("cancel")}
                </button>
              </div>
            </form>
            {active === "default" && (
              <DefaultEndingPreview
                imageUrl={isImageUploadEnabled ? previewImageUrl : undefined}
                label={isLabelEnabled ? label : undefined}
                description={isDescriptionEnabled ? description : undefined}
                buttonText={reloadOrRedirect ? buttonText : undefined}
                reloadOrRedirectButton={reloadOrRedirect}
                autoReload={autoReload}
                reloadTimeInSeconds={reloadTimeInSeconds}
                shareSurvey={shareSurvey}
                anotherLink={anotherLink ?? undefined}
                redirectToWhat={redirectToWhat ?? undefined}
              />
            )}
            {active === "custom" && <RedirectEndingPreview />}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default EditEndings;
