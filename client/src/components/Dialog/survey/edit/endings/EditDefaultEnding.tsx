import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLanguage } from "../../../../lang/LanguageProvider";
import {
  setAnotherLink,
  setAutoReload,
  setButtonText,
  setRedirectToWhat,
  setReloadOrRedirect,
  setReloadTimeInSeconds,
  setShareSurvey,
} from "../../../../../store/slices/defaultEnding";
import {
  setDefaultEnding,
  setDescription,
  setImageFile,
  setIsDescriptionEnabled,
  setIsImageUploadEnabled,
  setLabel,
  setPreviewImageUrl,
} from "../../../../../store/slices/sharedFormSlice";
import { RootState } from "../../../../../store/store";
import { returnFileAndUrl } from "../../../../../utils";
import InputSwitchField from "../../../../question/InputSwitchField";
import ImageUploadField from "../../../../question/ImageUploadField";
import SwitchContainer from "../../../../question/SwitchContainer";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import EnterRedirectLink from "../../../../question/endings/EnterRedirectLink";

const EditDefaultEnding: React.FC<{
  validationErrors: Record<string, string | undefined> | null;
}> = ({ validationErrors }) => {
  const dispatch = useDispatch();

  const { t } = useLanguage();

  const options = [
    { id: 1, name: "Survey Link (Reaload the Survey)" },
    { id: 2, name: "Results Link" },
    { id: 3, name: "Another Link" },
  ];

  const {
    isLabelEnabled,
    label,
    description,
    isImageUploadEnabled,
    isDescriptionEnabled,
    shareSurvey,
    defaultEnding,
    reloadOrRedirect,
    buttonText,
    autoReload,
    reloadTimeInSeconds,
    redirectToWhat,
    anotherLink,
  } = useSelector((state: RootState) => ({
    isLabelEnabled: state.welcomePage.isLabelEnabled,
    label: state.sharedForm.label,
    description: state.sharedForm.description,
    fileImage: state.sharedForm.fileImage,
    isImageUploadEnabled: state.sharedForm.isImageUploadEnabled,
    isDescriptionEnabled: state.sharedForm.isDescriptionEnabled,
    shareSurvey: state.defaultEnding.shareSurvey,
    defaultEnding: state.sharedForm.defaultEnding,
    reloadOrRedirect: state.defaultEnding.reloadOrRedirect,
    buttonText: state.defaultEnding.buttonText,
    autoReload: state.defaultEnding.autoReload,
    reloadTimeInSeconds: state.defaultEnding.reloadTimeInSeconds,
    redirectToWhat: state.defaultEnding.redirectToWhat,
    anotherLink: state.defaultEnding.anotherLink,
  }));
  const [selected, setSelected] = useState<string>(redirectToWhat);
  console.log("in default ending", redirectToWhat);
  const [file, setFile] = useState<File | null>(null);

  const handleSwitchChange =
    (
      field:
        | "shareSurvey"
        | "description"
        | "imageUpload"
        | "defaultEnding"
        | "reloadOrRedirectButton"
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
      } else if (field === "reloadOrRedirectButton") {
        dispatch(setReloadOrRedirect(enabled));
        setSelected(options[0].name);
        dispatch(setRedirectToWhat("Survey Link (Reaload the Survey)"));
      } else if (field === "autoReload") {
        dispatch(setAutoReload(enabled));
      }
    };

  useEffect(() => {
    if (redirectToWhat) {
      setSelected(redirectToWhat);
    } else {
      setSelected(options[0].name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [redirectToWhat]);

  const handleFileChange = async (file: File | null) => {
    const { file: _file, url } = await returnFileAndUrl(file);

    setFile(_file);
    dispatch(setImageFile({ fileType: _file?.type, fileSize: _file?.size }));
    dispatch(setPreviewImageUrl(url));
  };
  return (
    <div className="flex flex-col justify-between  shrink-0 flex-grow rounded-md text-sm w-full ">
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
        label={t("Label")}
        editorId="label"
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
        editorId="description"
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
      <div className="flex flex-col gap-2  pb-8">
        <InputSwitchField
          label={t("reloadOrRedirect")}
          value={buttonText}
          onChange={(e) => dispatch(setButtonText(e.target.value))}
          switchChecked={reloadOrRedirect}
          onSwitchChange={handleSwitchChange("reloadOrRedirectButton")}
          placeholder={t("buttonText")}
          required={false}
          hasSwitch={true}
          type={"text"}
          border={false}
          errorMessage={validationErrors?.buttonText}
        />
        {reloadOrRedirect && (
          <div className="flex flex-col justify-between gap-2 px-4  main_text  flex-wrap">
            <span className="main_text">{t("redirectTo")}</span>
            <Listbox
              value={redirectToWhat}
              onChange={(
                value:
                  | "Results Link"
                  | "Another Link"
                  | "Survey Link (Reaload the Survey)"
              ) => {
                setSelected(value);
                dispatch(setRedirectToWhat(value));
                if (
                  redirectToWhat?.toLocaleLowerCase() !==
                  "Another Link".toLowerCase()
                ) {
                  dispatch(setAutoReload(false));
                  dispatch(setReloadTimeInSeconds(10));
                }
              }}
            >
              <div className="relative">
                <ListboxButton className="cursor-default py-2 px-4 w-full text-left bg-transparent border border-[#85808025]">
                  <span className="block truncate">
                    {" "}
                    {redirectToWhat === "Survey Link (Reaload the Survey)"
                      ? t("surveyLink")
                      : selected === "Results Link"
                      ? t("resultsLink")
                      : selected === "Another Link"
                      ? t("anotherLink")
                      : redirectToWhat}
                  </span>
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
                            selected ? "font-medium bg-blue-600" : "font-normal"
                          }`}
                        >
                          {option.name.toLowerCase() ===
                          "survey link (reaload the survey)".toLowerCase()
                            ? t("surveyLink")
                            : option.name.toLowerCase() ===
                              "results link".toLowerCase()
                            ? t("resultsLink")
                            : option.name.toLowerCase() ===
                              "another link".toLowerCase()
                            ? t("anotherLink")
                            : option.name}
                        </span>
                      )}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </div>
            </Listbox>
          </div>
        )}
        {selected.toLowerCase() === "Another Link".toLowerCase() && (
          <EnterRedirectLink
            label={t("enterLink")}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              dispatch(setAnotherLink(e.target.value))
            }
            errorMessage={validationErrors?.anotherLink}
            value={anotherLink ?? undefined}
          />
        )}
      </div>
      {(selected.toLowerCase() ===
        "Survey Link (Reaload the Survey)".toLowerCase() ||
        redirectToWhat.toLowerCase() === "Results Link".toLowerCase()) && (
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
  );
};

export default EditDefaultEnding;
