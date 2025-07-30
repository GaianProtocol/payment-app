import { useUser } from "@/hooks/use-user";
import authSolApi from "@/services/authSol.service";
import { useLinkAccount } from "@privy-io/react-auth";
import { useEffect } from "react";

export const LinkEmail = () => {
  const { linkEmail } = useLinkAccount({
    onSuccess: async ({ user }) => {
      if (user.email?.address) {
        await handleUpdateEmail(user.email?.address);
      }
    },
  });
  const { user, authenticated, fetchUser } = useUser();

  const handleUpdateEmail = async (email: string) => {
    try {
      const res = await authSolApi.updateEmail({ email });
      if (res) {
        await fetchUser({ signRequired: false });
      }
    } catch (error) {
      console.log("🚀 ~ file: LinkEmail.tsx:17 ~ useEffect ~ error:", error);
    }
  };

  useEffect(() => {
    if (authenticated && user) {
      const linkedAccounts = user.privyUser.linkedAccounts;
      if (linkedAccounts) {
        const linkedEmail = linkedAccounts.filter((account) =>
          ["email", "google_oauth"].some((type) => type === account.type)
        );

        if (!linkedEmail.length) {
          try {
            linkEmail();
          } catch (error) {
            console.log(
              "🚀 ~ file: LinkEmail.tsx:17 ~ useEffect ~ error:",
              error
            );
          }
        }

        if (!user.email) {
          if (user?.privyUser?.google?.email) {
            handleUpdateEmail(user?.privyUser?.google.email);
            return;
          } else if (user?.privyUser?.email) {
            handleUpdateEmail(user?.privyUser?.email.address);
            return;
          }
        }
      }
    }
  }, [user, authenticated]);
  return null;
};
