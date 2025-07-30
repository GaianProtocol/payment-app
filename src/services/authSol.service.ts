import { AccountTeleResponse } from "@/types/spin.type";
import { camelCaseKeys } from "@/utils/camelcase";
import { axios } from ".";

const login = async (
  publicAddress: string,
  signedString: string,
  nonce: string,
  infoUser: any
): Promise<any> => {
  const data = {
    publicAddress: publicAddress,
    signedString: signedString,
    nonce: nonce,
    invitedBy: "",
    socialdata: infoUser,
  };
  const res = await axios.post(`/auth`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res;
};

const updateEmail = async (infoUser: any) => {
  const data = {
    socialdata: infoUser
  };
  const res = await axios.post(`/user/profile/update`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res;
};

const requestNonce = async (publicAddress: string) => {
  const data = {
    publicAddress: publicAddress,
  };
  const res = await axios.post(`/nonce`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res;
};

const updateReferralProfile = async (
  publicAddress: any,
  invitedBy: any
) => {
  const data = {
    publicAddress: publicAddress,
    invitedBy: invitedBy,
  };

  const res: any = await axios.post(`/user/profile/update-referral`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res;
};

const getProfile = async () => {
  const res: any = await axios.get(`/user/profile`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return camelCaseKeys({ ...res.socialdata, ...res.user, rankPoint: res.rankPoint });
};

const getLeaderboard = async () => {
  const res: any = await axios.get(`/refer/leaderboard`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res;
};

const checkAdminRole = async () => {
  const res: any = await axios.get(`/user/admin-role`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return !!res.isAdmin;
};
const checkUserHaveTelegram = async (): Promise<AccountTeleResponse> => {
  const res: any = await axios.get(`/user/telegram`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return camelCaseKeys(res);
}

const disconnectTelegram = async () => {
  const res: any = await axios.post(`/user/disconnect/tele`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

const checkProductStatus = async () => {
  const res: any = await axios.get(`/product-status`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res
}

const authSolApi = {
  login,
  requestNonce,
  updateReferralProfile,
  getProfile,
  checkAdminRole,
  getLeaderboard,
  checkUserHaveTelegram,
  disconnectTelegram,
  checkProductStatus,
  updateEmail
};

export default authSolApi;
