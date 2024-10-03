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
  onSelect: (workspace: WorkSpaceModel) => void;
}
export interface SurveyProps {
  survey: SurveyModel;
  selected: boolean;
  onSelect: (survey: SurveyModel) => void;
}
