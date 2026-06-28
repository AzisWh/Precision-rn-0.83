import { VerifyPinRequest, VerifyPinResponse } from "../type/pin";

const DUMMY_PIN = '123456';

const delay = (ms: number) => new Promise<void>(resolve => setTimeout(() => resolve(), ms));

export const verifyPinApi = async (req: VerifyPinRequest): Promise<VerifyPinResponse> => {
  await delay(1000);

  if (req.pin !== DUMMY_PIN) {
    throw { status: 401, message: 'PIN salah, silakan coba lagi' };
  }

  return {
    status: 200,
    message: 'Verifikasi berhasil',
    data: { verified: true, userName: 'User Demo' },
  };
};
