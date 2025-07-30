import { ACCESS_TOKEN } from "@/utils/constant";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export interface IProfile {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  publicAddress: string;
  nonce: string | null;
  signedString: string;
  referralCode: string;
  invitedBy: string | null;
  incomeEarned: number | null;
  frens: number | null;
  userType: string | null;
  name: string | null;
  address: string | null;
  phoneNumber: string | null;
  email: string | null;
  idFrontImage: string | null;
  idBackImage: string | null;
  rankPoint: number | null;
}

interface ModalState {
  profile?: IProfile;
  updateAccount: (profile?: IProfile) => void;
  clearAccount: () => void;
}

const profileStore = create<ModalState>()(
  devtools(
    persist(
      immer((set) => ({
        updateAccount: (profile?: IProfile) =>
          set({
            profile: profile,
          }),
        clearAccount: () =>
          set((draft: ModalState) => {
            if (draft.profile?.publicAddress) {
              draft.profile = undefined;
              localStorage.removeItem(ACCESS_TOKEN);
            }
          }),
      })),
      {
        version: 1,
        name: "Terry-store", // name of the item in the storage (must be unique)
        storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      }
    )
  )
);

export default profileStore;
