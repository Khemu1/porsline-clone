import { Dialog, DialogPanel } from "@headlessui/react";
import DefaultEnding from "./DefaultEnding";
import { useLanguage } from "../../lang/LanguageProvider";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { setIsSubmitting } from "../../../store/slices/sharedFormSlice";
import { validateWithSchema } from "../../../utils/welcomeQuestion";
import DefaultEndingPreview from "./DefaultEndingPreview";
import RedirectEnding from "./RedirectEnding";
import RedirectEndingPreview from "./RedirectEndingPreview";
import {
  customEndingSchema,
  defaultEndingSchema,
} from "../../../utils/endings";
import { clearEndingsFieldsForSwitch } from "../../../utils";

interface EndingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const Endings: React.FC<EndingsProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { t, getCurrentLanguage } = useLanguage();
  const [active, setActive] = useState<"default" | "custom">("default");
  const [validationErrors, setValidationErrors] = useState<Record<
    string,
    string | undefined
  > | null>(null);

  const {
    isLabelEnabled,
    label,
    description,
    isImageUploadEnabled,
    isDescriptionEnabled,
    previewImageUrl,
    shareSurvey,
    defaultEnding,
    ReloadOrDirectButton,
    buttonText,
    anotherLink,
    autoReload,
    reloadTimeInSeconds,
    redirectToWhat,
  } = useSelector((state: RootState) => ({
    isLabelEnabled: state.welcomePage.isLabelEnabled,
    label: state.sharedForm.label,
    description: state.sharedForm.description,
    isImageUploadEnabled: state.sharedForm.isImageUploadEnabled,
    isDescriptionEnabled: state.sharedForm.isDescriptionEnabled,
    previewImageUrl: state.sharedForm.previewImageUrl,
    shareSurvey: state.defaultEnding.shareSurvey,
    defaultEnding: state.sharedForm.defaultEnding,
    ReloadOrDirectButton: state.defaultEnding.ReloadOrDirectButton,
    buttonText: state.defaultEnding.buttonText,
    autoReload: state.defaultEnding.autoReload,
    reloadTimeInSeconds: state.defaultEnding.reloadTimeInSeconds,
    anotherLink: state.defaultEnding.anotherLink,
    redirectToWhat: state.defaultEnding.redirectToWhat,
  }));

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    try {
      setValidationErrors(null);
      e.preventDefault();
      setIsSubmitting(true);
      if (active === "default") {
        const defaultEndingData = {
          label,
          ...(isDescriptionEnabled && { description }),
          ...(isImageUploadEnabled && { imageFile: previewImageUrl }),
          ...(shareSurvey && { shareSurvey }),
          ...(buttonText.trim().length !== 0 && { buttonText }),
          ...(ReloadOrDirectButton &&
            redirectToWhat.toLowerCase() === "Another Link".toLowerCase() &&
            anotherLink?.trim().length !== 0 && {
              anotherLink,
            }),
          ...(autoReload && reloadTimeInSeconds && { reloadTimeInSeconds }),
          ...(ReloadOrDirectButton && { ReloadOrDirectButton }),
          ...(autoReload && { autoReload }),
          ...(ReloadOrDirectButton &&
            redirectToWhat?.trim().length !== 0 && {
              redirectToWhat,
            }),
          ...(defaultEnding && { defaultEnding }),
        };
        const schema = defaultEndingSchema(
          isDescriptionEnabled,
          isImageUploadEnabled,
          shareSurvey,
          defaultEnding,
          ReloadOrDirectButton,
          autoReload
        );

        console.log(schema.parse(defaultEndingData));
      }
      if (active === "custom") {
        const customEndingData = {
          anotherLink,
          ...(label.trim().length !== 0 && { label }),
          ...(defaultEnding && { defaultEnding }),
        };
        const schema = customEndingSchema(defaultEnding);
        console.log(schema.parse(customEndingData));
      }
    } catch (error) {
      setValidationErrors(validateWithSchema(error, getCurrentLanguage()));
      console.log("Error saving survey:", validationErrors);
    } finally {
      setIsSubmitting(false);
    }
  };
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
                      clearEndingsFieldsForSwitch(dispatch);
                    }}
                  >
                    End Page
                  </button>
                  <button
                    type="button"
                    className={`flex justify-center items-center flex-1 p-1  ${
                      active === "custom" ? "bg-[#242068]" : "bg-[#2420683a]"
                    }`}
                    onClick={() => {
                      setActive("custom");
                      clearEndingsFieldsForSwitch(dispatch);
                    }}
                  >
                    Redirect to URL
                  </button>
                </div>
              </div>

              {active === "default" && (
                <DefaultEnding validationErrors={validationErrors} />
              )}
              {active === "custom" && (
                <RedirectEnding validationErrors={validationErrors} />
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
                  Save
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-[#2f2b7226] main_text_bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
            {active === "default" && (
              <DefaultEndingPreview
                imageUrl={isImageUploadEnabled ? previewImageUrl : undefined}
                label={isLabelEnabled ? label : undefined}
                description={isDescriptionEnabled ? description : undefined}
                buttonText={ReloadOrDirectButton ? buttonText : undefined}
                reloadOrRedirectButton={ReloadOrDirectButton}
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

export default Endings;
