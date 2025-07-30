import TokenBg from "@/assets/images/token-bg.svg";
import { LogoWithoutText } from "@/assets/svgs";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useUser } from "@/hooks/use-user";
import { ROUTES } from "@/routes/paths.route";
import authSolApi from "@/services/authSol.service";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../ui/button";

export const InvitePopup = ({
  onSuccess,
  defaultOpen = false,
}: {
  onSuccess?: () => void;
  defaultOpen?: boolean;
}) => {
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(defaultOpen);
  const { user, fetchUser, isModalOpen } = useUser();
  const navigate = useNavigate();

  const textButton = useMemo(() => {
    return loading
      ? "Loading..."
      : user?.privyUser
      ? "Access Gaian"
      : "Connect Wallet";
  }, [loading, user?.privyUser]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const codeFromUrl = urlParams.get("code");
    if (codeFromUrl && /^[a-zA-Z0-9]{6}$/.test(codeFromUrl)) {
      setInviteCode(codeFromUrl.toUpperCase());
    }
  }, []);

  useEffect(() => {
    if (user?.privyUser && user.publicAddress) {
      if (user.invitedBy) {
        onSuccess && onSuccess();
        setOpen(false);
      } else {
        setOpen(true);
      }
    }
  }, [user, onSuccess]);

  const handleSubmit = useCallback(async () => {
    if (!user?.privyUser) {
      document.getElementById("header-connect")?.click();
      return;
    }
    if (inviteCode.length === 6 && user?.publicAddress) {
      try {
        setLoading(true);
        const data = await authSolApi.updateReferralProfile(
          user.publicAddress,
          inviteCode.toUpperCase()
        );
        if (!!data.user.invitedBy) {
          toast.success("Invite code submitted successfully!");
          await fetchUser({ signRequired: false });
          setOpen(false);
          onSuccess && onSuccess();
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.log("🚀 ~ handleSubmit ~ error:", error);
        toast.error("Invite code is invalid!");
        setLoading(false);
      } finally {
        setLoading(false);
      }
    } else {
      console.log("Invalid invite code");
    }
  }, [user, inviteCode]);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!isModalOpen) {
          setOpen(open);
          if (!open) {
            navigate(ROUTES.DASHBOARD);
          }
        }
      }}
    >
      <DialogContent
        overlayClassName="z-[201]"
        className="sm:max-w-[425px] z-[201] overflow-hidden outline-none border-none bg-gradient-to-b from-[#E1F8D3] to-[#ffffff]"
      >
        <img
          src={TokenBg}
          alt="Background token"
          className="absolute -top-10 left-1/2 -translate-x-1/2"
        />
        <DialogHeader>
          <div className="self-stretch inline-flex flex-col justify-start items-center gap-2">
            <div className="self-stretch flex flex-col justify-center items-center gap-1">
              <img
                src={LogoWithoutText}
                alt="GAIAN Logo"
                className="w-12 h-12"
              />
              <div className="self-stretch inline-flex justify-center items-center gap-2.5">
                <div className="justify-start text-[#151b11] text-xl font-semibold">
                  You’re almost there!
                </div>
              </div>
              <div className="self-stretch text-center justify-center text-[#57803e] text-sm font-normal leading-tight">
                Enter a referral code to unlock full access and start earning
                with Gaian.
              </div>
            </div>
          </div>
        </DialogHeader>
        <div className="bg-white flex flex-col gap-3 p-4 rounded-lg z-[1]">
          <div className="self-stretch inline-flex flex-col justify-start items-start gap-2">
            <div className="self-stretch flex flex-col justify-start items-start gap-4">
              <input
                type="text"
                value={inviteCode.toUpperCase()}
                disabled={loading}
                maxLength={6}
                placeholder="Enter referral code"
                onChange={(e) => setInviteCode(e.target.value)}
                className="self-stretch pl-4 pr-2 py-3 bg-[#f5f6f8]  rounded-lg inline-flex justify-between items-center"
              />
              <Button
                disabled={loading}
                onClick={handleSubmit}
                className="self-stretch text-primary-darker  h-10 pl-4 pr-5 py-3 bg-[#e1f8d3] rounded-full inline-flex justify-center items-center gap-2"
              >
                {textButton}
              </Button>
            </div>
            <div className="self-stretch text-center justify-center">
              <span className="text-gray text-xs font-normal leading-none">
                By verifying your wallet, you agree to our
              </span>
              <br />
              <a
                href="/"
                className="text-[#07a22c] text-xs font-normal underline"
              >
                Terms of Service
              </a>
              <span className="text-gray text-xs font-normal">
                &nbsp;and&nbsp;
              </span>
              <a
                href="/"
                className="text-[#07a22c] text-xs font-normal underline"
              >
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
