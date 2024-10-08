import { Dialog, DialogPanel } from "@headlessui/react";
import React, { useState } from "react";
import { useLanguage } from "../../lang/LanguageProvider";
import InputSwitchField from "../InputSwitchField";
import ImageUploadField from "../ImageUploadField";
import PreviewArea from "./PreviewWelcomeArea";
import { validateWithSchema } from "../../../utils/survey";
import { welcomeFormSchema } from "../../../utils/welcomeQuestion";

const Welcome = ({ isOpen, onClose }) => {
  const [validationErrors, setValidationErrors] = useState<Record<
    string,
    string
  > | null>(null);
  const { t, getCurrentLanguage } = useLanguage();
  const [label, setLabel] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isImageUploadEnabled, setIsImageUploadEnabled] = useState(false);
  const [isDescriptionEnabled, setIsDescriptionEnabled] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(true);
  const [isLabelEnabled, setIsLabelEnabled] = useState(true);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | undefined>(
    ""
  );

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
        ...(isImageUploadEnabled && { imageFile }),
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

  const handleFileChange = (file: File | null) => {
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImageUrl(undefined);
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
          <div className="flex items-center gap-5 border-b border-b-gray-500 pb-2 px-2">
            <button type="button" onClick={onClose}>
              <img
                src="/assets/icons/close.svg"
                alt="Close"
                className="w-[20px] h-[20px]"
              />
            </button>
            <span className="text-lg main_text_bold">{t("welcomePage")}</span>
          </div>
          <div className="flex h-full overflow-y-auto">
            {" "}
            {/* Enable vertical scrolling */}
            <form
              onSubmit={handleSave}
              className="flex flex-col space-y-4 w-full h-full overflow-y-scroll md:w-1/4 border-r border-r-gray-600 pb-4 pt-2 px-3"
            >
              <div className="flex flex-col flex-grow gap-5">
                <ImageUploadField
                  file={imageFile}
                  setFile={handleFileChange}
                  title=""
                  label="Image"
                  switchChecked={isImageUploadEnabled}
                  onSwitchChange={setIsImageUploadEnabled}
                  errorMessage={validationErrors?.imageFile}
                />
                <InputSwitchField
                  label={t("Label")}
                  value={label}
                  onChange={(
                    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                  ) => setLabel(e.target.value)}
                  switchChecked={isLabelEnabled}
                  onSwitchChange={setIsLabelEnabled}
                  placeholder={t("Label")}
                  disabled={isSubmitting}
                  required={false}
                  hasSwitch={true}
                  errorMessage={validationErrors?.label}
                  type="text"
                />
                <InputSwitchField
                  label={t("description")}
                  value={description}
                  onChange={(
                    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                  ) => setDescription(e.target.value)}
                  switchChecked={isDescriptionEnabled}
                  onSwitchChange={setIsDescriptionEnabled}
                  placeholder={t("description")}
                  disabled={isSubmitting}
                  required={false}
                  hasSwitch={true}
                  errorMessage={validationErrors?.description}
                  type="textarea"
                />
                <InputSwitchField
                  label={t("buttonText")}
                  value={buttonText}
                  onChange={(
                    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                  ) => setButtonText(e.target.value)}
                  switchChecked={isButtonEnabled}
                  onSwitchChange={setIsButtonEnabled}
                  placeholder="Add button text"
                  disabled={isSubmitting}
                  required={false}
                  hasSwitch={false}
                  errorMessage={
                    !isLabelEnabled &&
                    !isImageUploadEnabled &&
                    !isDescriptionEnabled &&
                    isButtonEnabled
                      ? t("mainfieldsEmpty")
                      : validationErrors?.buttonText
                  }
                  type="text"
                />
              </div>

              <div className="flex justify-start gap-5 items-center p-4">
                <button
                  disabled={
                    isSubmitting ||
                    (!isLabelEnabled &&
                      !isImageUploadEnabled &&
                      !isDescriptionEnabled &&
                      isButtonEnabled)
                  }
                  type="submit"
                  className={`${
                    isSubmitting ||
                    (!isLabelEnabled &&
                      !isImageUploadEnabled &&
                      !isDescriptionEnabled &&
                      isButtonEnabled)
                      ? "bg-[#0000001e]"
                      : "bg-[#2f2b72] "
                  } transition-all main_text_bold py-2 px-4 rounded`}
                >
                  {t("save")}
                </button>
                <button
                  type="button"
                  onClick={onClose}
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
