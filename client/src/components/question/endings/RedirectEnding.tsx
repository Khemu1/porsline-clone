import InputSwitchField from "../InputSwitchField";
import { useLanguage } from "../../lang/LanguageProvider";
import SwitchContainer from "../SwitchContainer";
import {} from "@headlessui/react";
import { RootState } from "../../../store/store";
import { useDispatch, useSelector } from "react-redux";
import EnterRedirectLink from "./EnterRedirectLink";
import {
  setDefaultEnding,
  setLabel,
} from "../../../store/slices/sharedFormSlice";
import { setRedirectUrl } from "../../../store/slices/redirectEnding";

const RedirectEnding: React.FC<{
  validationErrors: Record<string, string | undefined> | null;
}> = ({ validationErrors }) => {
  const dispatch = useDispatch();
  const { t } = useLanguage();
  const { isLabelEnabled, label, defaultEnding } = useSelector(
    (state: RootState) => ({
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
    })
  );

  return (
    <div className="flex flex-col flex-grow  overflow-hidden shrink-0 rounded-md text-sm w-full ">
      <EnterRedirectLink
        label={"Respondents are directed to the following URL"}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          dispatch(setRedirectUrl(e.target.value))
        }
        bold={true}
        border={true}
        errorMessage={validationErrors?.redirectUrl}
      />

      <InputSwitchField
        label={t("Label")}
        value={label}
        onChange={(e) => dispatch(setLabel(e.target.value))}
        switchChecked={isLabelEnabled}
        placeholder={t("Label")}
        required={false}
        hasSwitch={false}
        type={"text"}
        border={false}
        errorMessage={validationErrors?.label}
      />
      <SwitchContainer
        label={t("defaultEnding")}
        isRequired={defaultEnding}
        setIsRequired={(isRequired: boolean) =>
          dispatch(setDefaultEnding(isRequired))
        }
        errorMessage={validationErrors?.defaultEnding}
      />
    </div>
  );
};

export default RedirectEnding;
