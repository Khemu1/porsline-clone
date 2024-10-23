import User from "../db/models/User";

export interface GroupModel {
  id: number;
  maker: number;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  UserGroups?: UserGroupModel[];
}
export interface UserModel {
  id: number;
  username: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  groupId?: number;
  workspaces?: WorkSpaceModel[];
  UserGroups?: UserGroupModel[];
}

export interface UserGroupModel {
  userId: number;
  groupId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WorkSpaceModel {
  id: number;
  maker: number;
  title: string;
  groupId: number;
  createdAt?: Date;
  updatedAt?: Date;
  surveys?: SurveyModel[];
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
  questions?: GenericTextModel[];
  defaultEndings?: DefaultEndingModel[];
  customEndings?: CustomEndingModel[];
}
export interface UpdateSurveyModel {
  id: number;
  title: string;
  sisActive: boolean;
  url: string;
  workspace: number;
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

export interface SignUpParams {
  username: string;
  password: string;
}

export interface signInParams {
  username: string;
  password: string;
}
export interface SafeUser {
  id: string;
  username: string;
  email: string;
  role: string;
  groups?: UserGroupModel[];
  userGroup?: GroupModel;
}
export interface ReturnedJWTPaylod {
  id: number;
  userType: string;
  iat: number;
  exp: number;
  groups: UserGroupModel[];
  userGroup: GroupModel;
}
export interface NewWorkSpace {
  title: string;
}

export interface NewSurvey {
  title: string;
  active?: boolean;
}
export interface NewGroup {
  invitedUsers: number[];
  groupName: string;
}

export interface UpdateSurveyStatusResponse {
  updatedAt: Date;
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

export interface WelcomePartModel {
  id: number;
  surveyId: number;
  label: string;
  description?: string;
  buttonText?: string;
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NewWelcomePart {
  surveyId: number;
  label?: string;
  imageUrl?: string | null;
  description?: string;
  buttonText?: string;
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

export interface NewQuestion {
  surveyId: number;
  type: "text" | "regex";
  label: string;
  description?: string;
  imageUrl?: string;
  minLength?: number;
  maxLength?: number;
  isRequired?: boolean;
  regex?: string;
  regexPlaceHolder?: string;
  regexErrorMessage?: string;
  hideQuestionNumber?: boolean;
}

export interface editQuestion {
  surveyId: number;
  type: "text" | "regex";
  label: string;
  description?: string | null;
  imageUrl?: string | null;
  minLength?: number | null;
  maxLength?: number | null;
  isRequired?: boolean | null;
  regex?: string | null;
  regexPlaceHolder?: string | null;
  regexErrorMessage?: string | null;
  hideQuestionNumber?: boolean | null;
}

export interface NewQuestionOptions {
  isFormatText: boolean;
  isFormatRegex: boolean;
  hasPlaceHolder: boolean;
  hasRegexErrorMessage: boolean;
  hideQuestionNumber: boolean;
  isDescriptionEnabled: boolean;
  isImageUploadEnabled: boolean;
  isRequired: boolean;
}

export interface DefaultEndingModel {
  id: number;
  surveyId: number;
  label: string;
  type: "default" | "custom";
  description?: string;
  imageUrl?: string;
  shareSurvey?: boolean;
  defaultEnding?: boolean;
  reloadOrRedirect?: boolean;
  buttonText?: string;
  redirectToWhat?: string;
  anotherLink?: string;
  autoReload?: boolean;
  reloadTimeInSeconds?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CustomEndingModel {
  id: number;
  surveyId: number;
  type: "default" | "custom";
  redirectUrl: string;
  label?: string;
  description?: string;
  shareSurvey?: boolean;
  defaultEnding?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NewCustomEnding {
  surveyId: number;
  redirectUrl: string;
  type: "default" | "custom";
  label?: string;
  description?: string;
  shareSurvey?: boolean;
  defaultEnding?: boolean;
}

export interface NewDefaultEnding {
  surveyId: number;
  label: string;
  description?: string;
  type: "default" | "custom";
  shareSurvey?: boolean;
  imageUrl?: string;
  defaultEnding?: boolean;
  reloadOrRedirect?: boolean;
  buttonText?: string;
  redirectToWhat?: string;
  anotherLink?: string;
  autoReload?: boolean;
  reloadTimeInSeconds?: number;
}

export interface EditDefaultEnding {
  surveyId: number;
  label: string;
  description?: string | null;
  type: "default" | "custom";
  shareSurvey?: boolean;
  imageUrl?: string | null;
  defaultEnding?: boolean;
  reloadOrRedirect?: boolean;
  buttonText?: string | null;
  redirectToWhat?: string | null;
  anotherLink?: string | null;
  autoReload?: boolean;
  reloadTimeInSeconds?: number | null;
}

export interface DefaultEndingOptions {
  isDescriptionEnabled: boolean;
  isImageUploadEnabled: boolean;
  shareSurvey: boolean;
  defaultEnding: boolean;
  reloadOrRedirect: boolean;
  autoReload: boolean;
}
