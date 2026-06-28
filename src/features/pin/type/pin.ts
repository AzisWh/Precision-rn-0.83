import { ApiResponse } from "../../../type/api";

export type VerifyPinRequest = {
  pin: string;
  token: string;
};

export type VerifyPinData = {
  verified: boolean;
  userName: string;
};

export type VerifyPinResponse = ApiResponse<VerifyPinData>;