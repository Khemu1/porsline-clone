import { translations } from "../components/lang/translations";

export interface AuthSliceProps {
  id: number | null;
  username: string | null;
  groups: UserGroupModel[];
}

export interface SurveyModel {
  id: number;
  title: string;
  isActive: boolean;
  url: string;
  workspace: number;
  createdAt?: Date;
  updatedAt?: Date;
  welcomePart?: WelcomePartModel;
  questions: GenericTextModel[];
  defaultEndings: DefaultEndingModel[];
  customEndings: CustomEndingModel[];
}

export interface SurveyPreviewModel {
  id: number;
  title: string;
  isActive: boolean;
  url: string;
  workspace: number;
  createdAt?: Date;
  updatedAt?: Date;
  welcomePart?: WelcomePartModel[];
  questions: GenericTextModel[];
  ending: DefaultEndingModel | CustomEndingModel;
}

export interface GroupModel {
  id: number;
  maker: number;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  members: UserGroupModel[];
}

export interface UserModel {
  id: number;
  username: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  groupId: number;
  workspaces?: WorkSpaceModel[];
  userGroups?: UserGroupModel[];
  createdGroup: GroupModel;
}

export interface UserGroupModel {
  userId: number;
  groupId: number;
  createdAt?: string;
  updatedAt?: string;
  groupName: string;
  username: string;
}
export interface WorkSpaceModel {
  id: number;
  maker: number;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  surveys: SurveyModel[];
}

export interface SignInResponseProps {
  id: number;
  username: string;
  groups: UserGroupModel[];
}
export interface SignInProps {
  username: string;
  password: string;
}

export interface WorkspaceProps {
  workspace: WorkSpaceModel;
  selected: boolean;
  length: number;
  onSelect: (workspace: WorkSpaceModel) => void;
}
export interface SurveyProps {
  survey: SurveyModel;
  selected: boolean;
  onSelect: (survey: SurveyModel) => void;
}

export interface UpdateSurveyStatusResponse {
  updatedAt: Date;
  isActive: boolean;
}

export interface UpdateSurveyTitleProps {
  title: string;
  workspaceId: number;
  surveyId: number;
  getCurrentLanguageTranslations: () => (typeof translations)["en"];
  currentLang: "en" | "de";
}

export interface UpdateSurveyTitleResponse {
  title: string;
  updatedAt: Date;
}

export interface UpdateSurveyUrlResponse {
  url: string;
  updatedAt: Date;
}

export interface UpdateWorkspaceTitleResponse {
  title: string;
  updatedAt: Date;
}

export interface UpdateWorkspaceDescriptionResponse {
  description: string;
  updatedAt: Date;
}

export interface UpdateWorkspaceOwnerResponse {
  ownerId: number;
  updatedAt: Date;
}

export interface InputSwitchFieldProps {
  editorId?: string;
  label: string;
  value: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  switchChecked?: boolean;
  onSwitchChange?: (checked: boolean) => void;
  placeholder?: string;
  disabled?: boolean;
  isSubmitting?: boolean;
  hasSwitch: boolean;
  required: boolean;
  errorMessage?: string;
  type: string;
  border: boolean;
}

export interface FileUploaderProps {
  filePath?: string;
  file: File | null | undefined;
  setFile: (file: File | null) => void;
  title: string;
  initialImage?: string;
}

export interface WelcomePartModel {
  id: number;
  surveyId: number;
  label: string;
  description?: string;
  imageUrl?: string;
  buttonText?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface EndPartModel {
  id: number;
  surveyId: number;
  label: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface welcomePartOptions {
  isLabelEnabled: boolean;
  isDescriptionEnabled: boolean;
  isImageUploadEnabled: boolean;
}

export interface GenericTextModel {
  id: number;
  surveyId: number;
  label: string;
  description?: string;
  answerFormat: "text" | "regex";
  imageUrl?: string;
  required?: boolean;
  hideQuestionNumber?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  generalText?: GeneralTextModel;
  generalRegex?: GeneralRegexModel;
}

export interface GeneralTextModel {
  id: number;
  questionId: number;
  min: number;
  max: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GeneralRegexModel {
  id: number;
  questionId: number;
  regex: string;
  regexErrorMessage: string;
  regexPlaceHolder?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NewWelcomePart {
  surveyId: number;
  label?: string;
  imageUrl?: string;
  description?: string;
  buttonText?: string;
}

export interface DefaultEndingModel {
  id: number;
  surveyId: number;
  label: string;
  type: "custom" | "default";
  description?: string;
  imageUrl?: string;
  shareSurvey?: boolean;
  defaultEnding?: boolean;
  reloadOrRedirect?: boolean;
  buttonText?: string;
  redirectToWhat?:
    | "Results Link"
    | "Another Link"
    | "Survey Link (Reaload the Survey)";
  anotherLink?: string;
  autoReload?: boolean;
  reloadTimeInSeconds?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomEndingModel {
  id: number;
  surveyId: number;
  redirectUrl: string;
  type: "custom" | "default";
  label?: string;
  description?: string;
  shareSurvey?: boolean;
  defaultEnding?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewCustomEnding {
  surveyId: number;
  redirectUrl: string;
  label?: string;
  description?: string;
  shareSurvey?: boolean;
  defaultEnding?: boolean;
}

export interface NewDefaultEnding {
  surveyId: number;
  label: string;
  description?: string;
  shareSurvey?: boolean;
  imageUrl?: string;
  defaultEnding?: boolean;
  reloadOrRedirect?: boolean;
  buttonText?: string;
  redirectToWhat?: string;
  anotherLinkText?: string;
  autoReload?: boolean;
  reloadTimeInSeconds?: number;
}

export interface DefaultEndingOptions {
  isDescriptionEnabled: boolean;
  isImageUploadEnabled: boolean;
  shareSurvey: boolean;
  defaultEnding: boolean;
  reloadOrRedirectButton: boolean;
  autoReload: boolean;
}

export interface UpdateSurveyUrlProps {
  workspaceId: number;
  surveyId: number;
  url: string;
  getCurrentLanguageTranslations: () => (typeof translations)["en"];
  currentLang: "de" | "en";
}
