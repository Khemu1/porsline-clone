export enum RolesProps {
  ADMIN = "admin",
  USER = "user",
  SELLER = "seller",
}

export interface SignUpParams {
  username: string;
  role?: RolesProps;
  email: string;
  password: string;
}

export interface signInParams {
  usernameOrEmail: string;
  password: string;
}
export interface SafeUser {
  id: string;
  username: string;
  email: string;
  role: string;
}
export interface addProductParams {
  createdBy: number;
  title: string;
  description: string;
  shortDescription: string;
  isFeatured: boolean;
  productImage: string[];
  productUrl: string;
  tags: string[];
  category: string[];
  price: number;
}
export interface UpdateProductParams {
  createdBy?: number;
  title?: string;
  description?: string;
  shortDescription?: string;
  isFeatured?: boolean;
  productImage?: string[];
  productUrl?: string;
  tags?: string[];
  category?: string[];
  price?: number;
}
export interface ReturnedJWTPaylod {
  id: number;
  userType: string;
  iat: number;
  exp: number;
}
