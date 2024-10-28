import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, DialogPanel } from "@headlessui/react";
import InputSwitchField from "../InputSwitchField";
import ImageUploadField from "../ImageUploadField";
import PreviewArea from "./PreviewWelcomeArea";
import {
  setDescription,
  setImageFile,
  setIsDescriptionEnabled,
  setIsImageUploadEnabled,
  setIsSubmitting,
  setLabel,
  setPreviewImageUrl,
} from "../../../store/slices/sharedFormSlice";
import { RootState } from "../../../store/store";
import { useLanguage } from "../../lang/LanguageProvider";
import {
  validateWithSchema,
  welcomeFormSchema,
} from "../../../utils/welcomeQuestion";
import {
  setButtonText,
  setIsLabelEnabled,
} from "../../../store/slices/welcomePageSlice";
import {
  clearSlices,
  returnFileAndUrl,
  transformDataIntoFormData,
} from "../../../utils";
import { useAddWelcomePart } from "../../../hooks/welcomePart";
import { useParams } from "react-router-dom";
interface WelcomeProps {
  isOpen: boolean;
  onClose: () => void;
}
const Welcome: React.FC<WelcomeProps> = ({ isOpen, onClose }) => {
  const { workspaceId, surveyId } = useParams();
  const dispatch = useDispatch();
  const [validationErrors, setValidationErrors] = useState<Record<
    string,
    string | undefined
  > | null>(null);
  const { t, getCurrentLanguage, getCurrentLanguageTranslations } =
    useLanguage();
  const {
    isButtonEnabled,
    isLabelEnabled,
    buttonText,
    label,
    description,
    isImageUploadEnabled,
    isDescriptionEnabled,
    previewImageUrl,
    socketId,
  } = useSelector((state: RootState) => ({
    isButtonEnabled: state.welcomePage.isButtonEnabled,
    isLabelEnabled: state.welcomePage.isLabelEnabled,
    buttonText: state.welcomePage.buttonText,
    label: state.sharedForm.label,
    description: state.sharedForm.description,
    fileImage: state.sharedForm.fileImage,
    isImageUploadEnabled: state.sharedForm.isImageUploadEnabled,
    isDescriptionEnabled: state.sharedForm.isDescriptionEnabled,
    previewImageUrl: state.sharedForm.previewImageUrl,
    socketId: state.socket.socketId,
  }));

  const { handleAddWelcomePart, isSuccess } = useAddWelcomePart();

  const [file, setFile] = useState<File | null>(null);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setValidationErrors(null);
      setIsSubmitting(true);

      const options = {
        isLabelEnabled,
        isDescriptionEnabled,
        isImageUploadEnabled,
      };

      const schema = welcomeFormSchema(options);

      const welcomeData = {
        ...(isLabelEnabled && { label }),
        ...(isDescriptionEnabled && { description }),
        ...(isImageUploadEnabled && { imageUrl: previewImageUrl }),
        ...(buttonText && { buttonText }),
      };

      const data = schema.parse(welcomeData);

      const formData = new FormData();

      transformDataIntoFormData(data, formData);
      transformDataIntoFormData(
        { workspaceId: +workspaceId!, surveyId: +surveyId! },
        formData
      );
      transformDataIntoFormData(options, formData);
      await handleAddWelcomePart({
        welcomePart: formData,
        getCurrentLanguageTranslations,
        currentLang: getCurrentLanguage(),
      });

      setIsSubmitting(false);
    } catch (err: unknown) {
      setIsSubmitting(false);
      setValidationErrors(validateWithSchema(err, getCurrentLanguage()));
      console.error("Error saving welcome part:", err);
    }
  };

  const check3Fields = () => {
    if (
      isLabelEnabled === false &&
      isDescriptionEnabled === false &&
      isImageUploadEnabled === false
    ) {
      console.log("yes");
      setValidationErrors({ buttonText: t("mainfieldsEmpty") });
    } else {
      setValidationErrors({});
    }
  };
  const handleSwitchChange =
    (field: "label" | "description" | "imageUpload") => (enabled: boolean) => {
      if (field === "label") {
        dispatch(setIsLabelEnabled(enabled));
      } else if (field === "description") {
        dispatch(setIsDescriptionEnabled(enabled));
      } else if (field === "imageUpload") {
        dispatch(setIsImageUploadEnabled(enabled));
      }
    };
  useEffect(() => {
    check3Fields();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isLabelEnabled,
    isDescriptionEnabled,
    isImageUploadEnabled,
    isButtonEnabled,
  ]);
  console.log(socketId);

  const handleFileChange = async (file: File | null) => {
    const { file: _file, url } = await returnFileAndUrl(file);

    setFile(_file);
    dispatch(setImageFile({ fileType: _file?.type, fileSize: _file?.size }));
    dispatch(setPreviewImageUrl(url));
  };

  useEffect(() => {
    if (isSuccess) {
      onClose();
      clearSlices(dispatch);
    }
  }, [isSuccess]);
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
              className="flex flex-col space-y-4 w-full h-full overflow-y-scroll md:w-1/4 border-r border-r-gray-600 pb-4 pt-2 px-3"
            >
              <div className="flex gap-5 items-center text-lg main_text_bold border-b border-b-[#85808025] py-4">
                <button type="button" onClick={onClose}>
                  <img
                    src="/assets/icons/close.svg"
                    alt="Close"
                    className="w-[30px] h-[30px]"
                  />
                </button>
                <span>{t("welcomePage")}</span>
              </div>
              <div className="flex flex-col flex-grow gap-5">
                <ImageUploadField
                  file={file}
                  setFile={handleFileChange}
                  label={t("image")}
                  title=""
                  switchChecked={isImageUploadEnabled}
                  onSwitchChange={handleSwitchChange("imageUpload")}
                  errorMessage={validationErrors?.imageFile}
                />

                <InputSwitchField
                  editorId="label"
                  label={t("Label")}
                  value={label}
                  onChange={(e) => dispatch(setLabel(e.target.value))}
                  switchChecked={isLabelEnabled}
                  onSwitchChange={handleSwitchChange("label")}
                  placeholder={t("Label")}
                  required={false}
                  hasSwitch={true}
                  type={"editor"}
                  border={false}
                  errorMessage={validationErrors?.label}
                />

                <InputSwitchField
                  editorId="description"
                  label={t("description")}
                  value={description}
                  onChange={(e) => dispatch(setDescription(e.target.value))}
                  switchChecked={isDescriptionEnabled}
                  onSwitchChange={handleSwitchChange("description")}
                  placeholder={t("description")}
                  required={false}
                  hasSwitch={true}
                  type={"editor"}
                  border={false}
                  errorMessage={validationErrors?.description}
                />

                <InputSwitchField
                  label={t("buttonText")}
                  value={buttonText}
                  onChange={(e) => dispatch(setButtonText(e.target.value))}
                  switchChecked={true}
                  placeholder={t("buttonText")}
                  required={false}
                  hasSwitch={false}
                  type={"text"}
                  border={false}
                  errorMessage={validationErrors?.buttonText}
                />
              </div>

              <div className="flex justify-start gap-5 items-center p-4">
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

            <PreviewArea
              imageUrl={isImageUploadEnabled ? previewImageUrl : undefined}
              label={isLabelEnabled ? label : undefined}
              description={isDescriptionEnabled ? description : undefined}
              buttonText={isButtonEnabled ? buttonText : undefined}
            />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
export default Welcome;
