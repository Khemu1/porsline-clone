import {
  Dialog,
  DialogPanel,
  Listbox,
  ListboxOptions,
  ListboxOption,
  ListboxButton,
} from "@headlessui/react";
import React, { useState } from "react";
import { useLanguage } from "../../lang/LanguageProvider";
import InputSwitchField from "../InputSwitchField";
import ImageUploadField from "../ImageUploadField";
import { validateWithSchema } from "../../../utils/survey";
import PreviewGenericTextArea from "./PreviewGenericTextArea";
import SwitchContainer from "../SwitchContainer";
import { genericTextSchema } from "../../../utils/genericText";

const GenericTextQuestion = ({ isOpen, onClose }) => {
  const [validationErrors, setValidationErrors] = useState<Record<
    string,
    string
  > | null>(null);
  const [selected, setSelected] = useState("Text");

  const options = [
    { id: 1, name: "Text" },
    { id: 2, name: "Custom Pattern" },
  ];
  const { t, getCurrentLanguage } = useLanguage();
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isRequired, setIsRequired] = useState(false);
  const [hideQuestionNumber, setHideQuestionNumber] = useState(false);
  const [isImageUploadEnabled, setIsImageUploadEnabled] = useState(false);
  const [isDescriptionEnabled, setIsDescriptionEnabled] = useState(false);
  const [minLength, setMinLength] = useState<string | number>(0);
  const [maxLength, setMaxLength] = useState<string | number>(1);
  const [regex, setRegex] = useState("");
  const [regexPlaceHolder, setRegexPlaceHolder] = useState("");
  const [regexErrorMessage, setRegexErrorMessage] = useState("");
  const [previewImageUrl, setPreviewImageUrl] = useState<string | undefined>(
    ""
  );

  const validateMinMax = (minValue: number, maxValue: number) => {
    let newErrors = {};

    if (maxValue === undefined || maxValue === null) {
      newErrors = {
        ...newErrors,
        max: t("maxRequired"),
      };
    } else if (Number(maxValue) === 0) {
      newErrors = {
        ...newErrors,
        max: t("maxMustAtleastOne"),
      };
    }

    if (minValue === undefined || minValue === null) {
      newErrors = {
        ...newErrors,
        min: t("minRequired"),
      };
    }

    if (
      minValue !== undefined &&
      maxValue !== undefined &&
      Number(minValue) > Number(maxValue)
    ) {
      newErrors = {
        ...newErrors,
        min: t("minGreaterThanMax"),
      };
    }

    if (
      minValue !== undefined &&
      maxValue !== undefined &&
      Number(maxValue) < Number(minValue)
    ) {
      newErrors = {
        ...newErrors,
        max: t("MaxLesserThanMin"),
      };
    }

    if (Object.keys(newErrors).length > 0) {
      setValidationErrors(newErrors);
      return false;
    }

    setValidationErrors(null);
    return true;
  };

  const handleMinMaxChange = (type: "min" | "max", value: string) => {
    const parsedValue = Number(value);
    if (type === "min") {
      setMinLength(parsedValue);
      validateMinMax(parsedValue, Number(maxLength));
    } else {
      setMaxLength(parsedValue);
      validateMinMax(Number(minLength), parsedValue);
    }
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    try {
      setValidationErrors(null);
      e.preventDefault();
      setIsSubmitting(true);

      // const isValid = validateMinMax(Number(minLength), Number(maxLength));
      // if (!isValid) return;
      console.log(selected);
      const isCustomPattern = selected.toLowerCase() === "custom pattern";
      const isText = selected.toLowerCase() === "text";

      const schema = genericTextSchema(
        isText,
        isCustomPattern,
        regexPlaceHolder.trim().length !== 0,
        isCustomPattern,
        hideQuestionNumber,
        isDescriptionEnabled,
        isImageUploadEnabled,
        isRequired
      );

      const formData = {
        label,
        ...(isDescriptionEnabled && { description }),
        ...(isImageUploadEnabled && { imageFile }),
        ...(isCustomPattern && { regex, regexErrorMessage }),
        ...(regexPlaceHolder.trim().length !== 0 && { regexPlaceHolder }),
        ...(isText && { minLength, maxLength }),
        ...(isRequired && { isRequired }),
        ...(hideQuestionNumber && { hideQuestionNumber }),
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
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50 text-sm main_text"
    >
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
            <form
              onSubmit={handleSave}
              className="flex flex-col space-y-4 w-full h-full overflow-y-scroll md:w-1/4 border-r border-r-gray-600 pb-4 pt-2 px-3"
            >
              <div className="flex flex-col flex-grow gap-5 px-4">
                <InputSwitchField
                  label={t("Label")}
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  switchChecked={true}
                  placeholder={t("Label")}
                  disabled={isSubmitting}
                  required={false}
                  hasSwitch={false}
                  errorMessage={validationErrors?.label}
                  type="textarea"
                  border={true}
                />
                <InputSwitchField
                  label={t("description")}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  switchChecked={isDescriptionEnabled}
                  onSwitchChange={setIsDescriptionEnabled}
                  placeholder={t("description")}
                  disabled={isSubmitting}
                  required={false}
                  hasSwitch={true}
                  errorMessage={validationErrors?.description}
                  type="textarea"
                  border={true}
                />
                <div className="flex justify-between gap-4 p-4 main_text items-center flex-wrap">
                  <span className="main_text_bold">Answer Format</span>
                  <Listbox
                    value={selected}
                    onChange={(value) => {
                      setSelected(value);
                      setRegex("");
                      setRegexPlaceHolder("");
                      setRegexErrorMessage("");
                      setMaxLength(1);
                      setMinLength(0);
                    }}
                  >
                    <div className="relative">
                      <ListboxButton className="relative  cursor-default py-2 px-4 w-[150px] text-left bg-transparent border border-[#85808025]">
                        <span className="block truncate">{selected}</span>
                      </ListboxButton>
                      <ListboxOptions className="absolute mt-1 bg-transparent border w-[200px] border-[#85808025] shadow-lg max-h-60 rounded-md overflow-auto z-[51]">
                        {" "}
                        {options.map((option) => (
                          <ListboxOption
                            key={option.id}
                            value={option.name}
                            className={({ active }) =>
                              `cursor-pointer select-none relative text-white w-full ${
                                active
                                  ? "bg-[#141414] font-semibold"
                                  : "bg-black  font-semibold"
                              }`
                            }
                          >
                            {({ selected }) => (
                              <span
                                className={`block truncate p-2  ${
                                  selected
                                    ? "font-medium bg-blue-600"
                                    : "font-normal"
                                }`}
                              >
                                {option.name}
                              </span>
                            )}
                          </ListboxOption>
                        ))}
                      </ListboxOptions>
                    </div>
                  </Listbox>
                </div>
                {selected.toLowerCase() === "custom pattern" && (
                  <>
                    <InputSwitchField
                      label="Pattern(RegEx validation)"
                      value={regex}
                      onChange={(e) => setRegex(e.target.value)}
                      hasSwitch={false}
                      switchChecked={true}
                      required={false}
                      type="text"
                      border={false}
                      errorMessage={validationErrors?.regex}
                    />
                    <InputSwitchField
                      label="Example"
                      value={regexPlaceHolder}
                      onChange={(e) => setRegexPlaceHolder(e.target.value)}
                      hasSwitch={false}
                      switchChecked={true}
                      required={false}
                      type="text"
                      border={false}
                      errorMessage={validationErrors?.regexPlaceHolder}
                    />
                    <InputSwitchField
                      label="Message to display when answer does not pass RegEx "
                      value={regexErrorMessage}
                      onChange={(e) => setRegexErrorMessage(e.target.value)}
                      hasSwitch={false}
                      switchChecked={true}
                      required={false}
                      type="text"
                      border={true}
                      errorMessage={validationErrors?.regexErrorMessage}
                    />
                  </>
                )}
                {selected.toLowerCase() === "text" && (
                  <div className=" flex flex-col gap-2 border-b border-b-[#85808025] px-4">
                    <span className="main_text_bold">Min/Max characters</span>
                    <InputSwitchField
                      label={t("min")}
                      value={minLength.toString()}
                      onChange={(e) =>
                        handleMinMaxChange("min", e.target.value)
                      }
                      switchChecked={true}
                      placeholder={t("min")}
                      disabled={isSubmitting}
                      required={true}
                      hasSwitch={false}
                      errorMessage={validationErrors?.minLength}
                      type="number"
                      border={false}
                    />
                    <InputSwitchField
                      label={t("max")}
                      value={maxLength.toString()}
                      onChange={(e) =>
                        handleMinMaxChange("max", e.target.value)
                      }
                      switchChecked={true}
                      placeholder={t("max")}
                      disabled={isSubmitting}
                      required={true}
                      hasSwitch={false}
                      errorMessage={validationErrors?.maxLength}
                      type="number"
                      border={false}
                    />
                  </div>
                )}
                <ImageUploadField
                  file={imageFile}
                  setFile={handleFileChange}
                  title=""
                  label="Image"
                  switchChecked={isImageUploadEnabled}
                  onSwitchChange={setIsImageUploadEnabled}
                  errorMessage={validationErrors?.imageFile}
                />
                <SwitchContainer
                  label={t("isRequired")}
                  isRequired={isRequired}
                  setIsRequired={setIsRequired}
                  errorMessage={validationErrors?.isRequired}
                />
                <SwitchContainer
                  label={t("hideQuestionNumber")}
                  isRequired={hideQuestionNumber}
                  setIsRequired={setHideQuestionNumber}
                  errorMessage={validationErrors?.hideQuestionNumber}
                />
              </div>

              <div className="flex justify-start gap-5 items-center p-4">
                <button
                  disabled={
                    isSubmitting ||
                    (label.length === 0 &&
                      !isImageUploadEnabled &&
                      !isDescriptionEnabled)
                  }
                  type="submit"
                  className={`${
                    isSubmitting ||
                    (label.length === 0 &&
                      !isImageUploadEnabled &&
                      !isDescriptionEnabled)
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
            <PreviewGenericTextArea
              imageUrl={isImageUploadEnabled ? previewImageUrl : undefined}
              label={label ? label : undefined}
              description={isDescriptionEnabled ? description : undefined}
              isRequired={isRequired}
              regex={regex.trim().length !== 0 ? regex : undefined}
              regexErrorMessage={regexErrorMessage}
              regexPlaceHolder={regexPlaceHolder}
              max={+maxLength}
              min={+minLength}
              answerFormat={selected}
              hideQuestionNumber={hideQuestionNumber}
            />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default GenericTextQuestion;
