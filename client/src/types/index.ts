import { translations } from "../components/lang/translations";

export interface AuthSliceProps {
  id: number | null;
  username: string | null;
}
// export interface WorkSpaceSliceProps {
//   WorkSpaces: WorkSpaceModel[];
// }

// export interface SurveySliceProps {
//   surveys: SurveyModel[] | [];
// }

export interface WorkSpaceModel {
  id: number;
  maker: number;
  title: string;
  groupId: number;
  createdAt: Date;
  updatedAt: Date;
  surveys: SurveyModel[];
}

export interface SurveyModel {
  id: number;
  title: string;
  isActive: boolean;
  workspace: number;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SignInResponseProps {
  userId: number;
  username: string;
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
