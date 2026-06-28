import { ApiResponse } from "../../../type/api";
import { UserRole } from "./auth";

export type LoginRequest = {
  phone: string;
  password: string;
};

export type LoginData = {
  token: string;
  phone: string;
  role : UserRole;
  full_name : string;
};

export type LoginResponse = ApiResponse<LoginData>;