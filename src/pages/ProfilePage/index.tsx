import ExploreIcon from "@/assets/images/explore-icon.png";
import { Header } from "@/components";
import Footer from "@/components/Footer";
import ContentLayout from "@/layouts/ContentLayout";
import LayoutContainer from "@/layouts/LayoutContainer";
import PageLayout from "@/layouts/PageLayout";
import { cn } from "@/utils/cn";
import ConnectWalletProfile from "./ConnectWalletProfile";
import InfoProfile from "./InfoProfile";
import MintProfile from "./MintProfile";
import SelectAvatar from "./SelectAvatar";

export default function ProfilePage() {
  return (
    <PageLayout>
      <LayoutContainer>
        <Header />
        <ContentLayout>
          <div className="max-w-[570px] w-full mx-auto py-6">
            <InfoProfile />
            <div className="mt-6"></div>
            <div className="space-y-3">
              <ConnectWalletProfile />
              <SelectAvatar />
              <MintProfile />
              <button
                className={cn(
                  "flex px-5 py-4 min-w-[132px] items-center justify-center gap-2",
                  "rounded-[70px] border border-white border-opacity-10",
                  "mx-auto"
                )}
                style={{
                  background:
                    "radial-gradient(63.86% 63.86% at 50% 50%, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.1) 100%)",
                }}
              >
                <div className="uppercase min-w-max text-xs font-normal tracking-wider text-white">
                  Play now
                </div>
                <img src={ExploreIcon} className="md:w-5 md:h-5 w-4 h-4" />
              </button>
            </div>
          </div>
        </ContentLayout>
        <Footer />
      </LayoutContainer>
    </PageLayout>
  );
}
