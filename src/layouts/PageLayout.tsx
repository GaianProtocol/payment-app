import bgSVG from "@/assets/svgs/background.svg";
import { useUser } from "@/hooks/use-user";
import InstallReloadCache from "@/providers/InstallReloadCache";
import { LinkEmail } from "@/providers/LinkEmail";
import { ROUTES } from "@/routes/paths.route";
import { cn } from "@/utils/cn";
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function PageLayout({
  children,
  authRequired = false,
}: {
  children: ReactNode;
  authRequired?: boolean;
}) {
  const { user, isLoading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (authRequired) {
      if (!isLoading && !user) {
        navigate(ROUTES.DASHBOARD);
      }
    }
  }, [user, isLoading, authRequired]);

  return (
    <div className="relative bg-white min-h-[100svh]">
      <InstallReloadCache />
      <LinkEmail />
      <div className="h-[100svh] z-[1] fixed  left-0 right-0 overflow-y-hidden w-screen">
        <img
          className={cn("w-full h-[600px] object-cover")}
          src={bgSVG}
          alt="background"
        />
      </div>
      {children}
    </div>
  );
}
