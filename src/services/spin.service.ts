import { CheckSpinResponse, IReward, SpinResponse } from "@/types/spin.type";
import { camelCaseKeys } from "@/utils/camelcase";
import { axios } from ".";

const checkSpinTimer = async (userId: number): Promise<CheckSpinResponse> => {
  const res: any = await axios.get(`/game/spin/check/${userId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res;
}

const spinGame = async (userId: number): Promise<SpinResponse> => {
  const response: any = await axios.post(`/game/spin/${userId}`, {}, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
}

const getReward = async (): Promise<IReward[]> => {
  const res: any = await axios.get(`/game/achivements`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return camelCaseKeys(res.vouchers);
}

const checkTelegram = async (teleUsername: string): Promise<boolean> => {
  const res: any = await axios.get(`/game/checktele/${teleUsername}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return !!res.status;
}

const spinService = {
  checkSpinTimer,
  spinGame,
  getReward,
  checkTelegram
};

export default spinService;
