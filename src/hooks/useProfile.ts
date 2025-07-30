import authSolApi from "@/services/authSol.service";
import profileStore, { IProfile } from "@/store/profileStore";
import { ACCESS_TOKEN } from "@/utils/constant";

export const useProfile = () => profileStore((state) => state.profile);

export const useUpdateProfile = () =>
  profileStore((state) => state.updateAccount);

export const useClearProfile = () =>
  profileStore((state) => state.clearAccount);

export const useFetchProfile = () => {
  const update = useUpdateProfile();
  const getProfile = async () => {
    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (!token) return;
      const me = await authSolApi.getProfile();
      update(me as unknown as IProfile);
    } catch (error) {
      update(undefined);
      console.log("🚀 ~ getProfile ~ error:", error);
    }
  };
  return { getProfile };
};
