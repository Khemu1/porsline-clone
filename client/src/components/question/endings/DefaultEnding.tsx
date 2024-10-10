import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import {
  setDefaultEnding,
  setDescription,
  setImageFile,
  setIsDescriptionEnabled,
  setIsImageUploadEnabled,
  setIsSubmitting,
  setLabel,
  setPreviewImageUrl,
} from "../../../store/slices/sharedFormSlice";
import {
  validateWithSchema,
  welcomeFormSchema,
} from "../../../utils/welcomeQuestion";
import { returnFileAndUrl } from "../../../utils";
import ImageUploadField from "../ImageUploadField";
import InputSwitchField from "../InputSwitchField";
import { useLanguage } from "../../lang/LanguageProvider";
import SwitchContainer from "../SwitchContainer";
import {
  setAnotherLink,
  setAutoReload,
  setButtonText,
  setRedirectToWhat,
  setReloadOrDirectButton,
  setReloadTimeInSeconds,
  setShareSurvey,
} from "../../../store/slices/defaultEnding";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import EnterRedirectLink from "./EnterRedirectLink";
import DefaultEndingPreview from "./DefaultEndingPreview";

const DefaultEnding = ({ onClose }) => {
  const dispatch = useDispatch();
  const [validationErrors, setValidationErrors] = useState<Record<
    string,
    string | undefined
  > | null>(null);
  const { t, getCurrentLanguage } = useLanguage();

  const options = [
    { id: 1, name: "Survey Link (Reaload the Survey)" },
    { id: 2, name: "Results Link" },
    { id: 3, name: "Another Link" },
  ];

  const [selected, setSelected] = useState(options[0].name);

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
    fileImage: state.sharedForm.fileImage,
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

  const handleSwitchChange =
    (
      field:
        | "shareSurvey"
        | "description"
        | "imageUpload"
        | "defaultEnding"
        | "ReloadOrDirectButton"
        | "autoReload"
    ) =>
    (enabled: boolean) => {
      if (field === "shareSurvey") {
        dispatch(setShareSurvey(enabled));
      } else if (field === "description") {
        dispatch(setIsDescriptionEnabled(enabled));
      } else if (field === "imageUpload") {
        dispatch(setIsImageUploadEnabled(enabled));
      } else if (field === "defaultEnding") {
        dispatch(setDefaultEnding(enabled));
      } else if (field === "ReloadOrDirectButton") {
        if (
          selected.toLowerCase() !==
          "Survey Link (Reaload the Survey)".toLowerCase()
        ) {
          dispatch(setAutoReload(false));
          dispatch(setReloadTimeInSeconds(10));
        }
        dispatch(setReloadOrDirectButton(enabled));
        setSelected(options[0].name);
      } else if (field === "autoReload") {
        dispatch(setAutoReload(enabled));
      }
    };

  const handleFileChange = async (file: File | null) => {
    const { file: _file, url } = await returnFileAndUrl(file);

    setFile(_file);
    dispatch(setImageFile({ fileType: _file?.type, fileSize: _file?.size }));
    dispatch(setPreviewImageUrl(url));
  };
  return (
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
            placeholder={t("Label")}
            required={false}
            hasSwitch={false}
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
          <SwitchContainer
            label={t("shareSurvey")}
            isRequired={shareSurvey}
            setIsRequired={handleSwitchChange("shareSurvey")}
            errorMessage={validationErrors?.shareSurvey}
          />
          <SwitchContainer
            label={t("defaultEnding")}
            isRequired={defaultEnding}
            setIsRequired={handleSwitchChange("defaultEnding")}
            errorMessage={validationErrors?.defaultEnding}
          />
          <div className="flex flex-col gap-2 border-b border-b-[#85808025] pb-8">
            <InputSwitchField
              label={t("ReloadOrDirectButton")}
              value={buttonText}
              onChange={(e) => dispatch(setButtonText(e.target.value))}
              switchChecked={ReloadOrDirectButton}
              onSwitchChange={handleSwitchChange("ReloadOrDirectButton")}
              placeholder={t("buttonText")}
              required={false}
              hasSwitch={true}
              type={"text"}
              border={false}
              errorMessage={validationErrors?.ReloadOrDirectButton}
            />
            {ReloadOrDirectButton && (
              <div className="flex flex-col justify-between gap-2 px-4  main_text  flex-wrap">
                <span className="main_text">Redirect To</span>
                <Listbox
                  value={selected}
                  onChange={(value: "results" | "reload" | "anotherLink") => {
                    setSelected(value);
                    dispatch(setRedirectToWhat(value));
                  }}
                >
                  <div className="relative">
                    <ListboxButton className="cursor-default py-2 px-4 w-full text-left bg-transparent border border-[#85808025]">
                      <span className="block truncate">{selected}</span>
                    </ListboxButton>
                    <ListboxOptions className="absolute mt-1 bg-black border w-full top-8 border-[#85808025] shadow-lg max-h-60 overflow-y-auto z-[51]">
                      {options.map((option) => (
                        <ListboxOption
                          key={option.id}
                          value={option.name}
                          className={({ active }) =>
                            `cursor-pointer select-none relative text-white w-full ${
                              active
                                ? "bg-[#141414] font-semibold"
                                : "bg-black font-semibold"
                            }`
                          }
                        >
                          {({ selected }) => (
                            <span
                              className={`block truncate p-2 ${
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
            )}
            {selected.toLowerCase() === "Another Link".toLowerCase() &&
              ReloadOrDirectButton && (
                <EnterRedirectLink
                  label={t("enterLink")}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    dispatch(setAnotherLink(e.target.value))
                  }
                />
              )}
          </div>
          {selected.toLowerCase() ===
            "Survey Link (Reaload the Survey)".toLowerCase() && (
            <InputSwitchField
              label={t("autoReload")}
              value={reloadTimeInSeconds.toString()}
              onChange={(e) =>
                dispatch(setReloadTimeInSeconds(Number(e.target.value)))
              }
              onSwitchChange={handleSwitchChange("autoReload")}
              switchChecked={autoReload}
              required={false}
              hasSwitch={true}
              type={"timer"}
              border={false}
              errorMessage={validationErrors?.autoReload}
            />
          )}
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
    </div>
  );
};

export default DefaultEnding;
