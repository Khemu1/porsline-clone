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
import { returnFileAndUrl } from "../../../utils";

const Welcome = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [validationErrors, setValidationErrors] = useState<Record<
    string,
    string | undefined
  > | null>(null);
  const { t, getCurrentLanguage } = useLanguage();
  const {
    isButtonEnabled,
    isLabelEnabled,
    buttonText,
    label,
    description,
    isImageUploadEnabled,
    isDescriptionEnabled,
    previewImageUrl,
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
  }));

  const [file, setFile] = useState<File | null>(null);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    try {
      setValidationErrors(null);
      e.preventDefault();
      setIsSubmitting(true);
      const schema = welcomeFormSchema(
        isLabelEnabled,
        isDescriptionEnabled,
        isImageUploadEnabled
      );
      const formData = {
        ...(isLabelEnabled && { label }),
        ...(isDescriptionEnabled && { description }),
        ...(isImageUploadEnabled && { file }),
      };
      const data = schema.parse(formData);
      console.log(data);
    } catch (error) {
      setValidationErrors(validateWithSchema(error, getCurrentLanguage()));
      console.log("Error saving survey:", validationErrors);
    } finally {
      setIsSubmitting(false);
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

  const handleFileChange = async (file: File | null) => {
    const { file: _file, url } = await returnFileAndUrl(file);

    setFile(_file);
    dispatch(setImageFile({ fileType: _file?.type, fileSize: _file?.size }));
    dispatch(setPreviewImageUrl(url));
  };
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div
        className="fixed inset-0 bg-black bg-opacity-30"
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="bg-[#1e1e1e] rounded-md w-full h-full flex flex-col">
          <div className="flex items-center gap-5 border-b border-b-gray-500 pb-2 px-2">
            <button type="button" onClick={onClose}>
              <img
                src="/assets/icons/close.svg"
                alt="Close"
                className="w-[20px] h-[20px]"
              />
            </button>
            <span className="text-lg main_text_bold">Welcome Page</span>
          </div>
          <div className="flex h-full overflow-y-auto">
            <form
              onSubmit={handleSave}
              className="flex flex-col space-y-4 w-full h-full overflow-y-scroll md:w-1/4 border-r border-r-gray-600 pb-4 pt-2 px-3"
            >
              <div className="flex flex-col flex-grow gap-5">
                <ImageUploadField
                  file={file}
                  setFile={handleFileChange}
                  label="Image"
                  title=""
                  switchChecked={isImageUploadEnabled}
                  onSwitchChange={handleSwitchChange("imageUpload")}
                  errorMessage={validationErrors?.imageFile}
                />

                <InputSwitchField
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
