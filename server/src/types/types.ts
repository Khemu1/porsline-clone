export interface GroupModel {
  id: number;
  userId: number;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface UserModel {
  id: number;
  username: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
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
  createdAt?: Date;
  updatedAt?: Date;
}
export interface SurveyModel {
  id: number;
  title: string;
  active?: boolean;
  workspace: number;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface WelcomePartModel {
  id: number;
  surveyId: number;
  label: string;
  description?: string;
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
export interface GeneralTextModel {
  id: number;
  surveyId: number;
  label: string;
  description?: string;
  min: number;
  max: number;
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
}
export interface ReturnedJWTPaylod {
  id: number;
  userType: string;
  iat: number;
  exp: number;
}
export interface NewWorkSpace {
  title: string;
}

export interface NewSurvey {
  title: string;
  active?: boolean;
}
export interface NewGroup {
  invitedUsers: string[];
}
