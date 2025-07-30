import QRCodeImg from "@/assets/images/qr-code.jpg";
import { ArrowRight } from "@/assets/svgs";
import { Header } from "@/components";
import Footer from "@/components/Footer";
import { InvitePopup } from "@/components/Invite";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUser } from "@/hooks/use-user";
import ContentLayout from "@/layouts/ContentLayout";
import LayoutContainer from "@/layouts/LayoutContainer";
import PageLayout from "@/layouts/PageLayout";
import { ROUTES } from "@/routes/paths.route";
import { cn } from "@/utils/cn";
import { FOOTER_HEIGHT, HEADER_HEIGHT } from "@/utils/constant";
import { useNavigate } from "react-router-dom";
import { ScanCode } from "./ScanCode";

export default function ScanQR() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <div className="h-full w-full">
      {user?.id && !user.invitedBy && <InvitePopup />}
      <div className="md:hidden">
        <ScanCode />
      </div>
      <div className="max-md:hidden">
        <PageLayout>
          <LayoutContainer>
            <Header />
            <ContentLayout>
              <div
                className={cn(
                  "bg-transparent max-w-[674px] !h-max w-full flex max-sm:justify-center mx-auto flex-col gap-4 px-2.5 md:px-[30px] py-16"
                )}
                style={{
                  minHeight: `calc(100svh - ${
                    FOOTER_HEIGHT + HEADER_HEIGHT
                  }px)`,
                }}
              >
                <div className="w-full md:w-[365px] relative mx-auto p-5 bg-primary rounded-3xl border inline-flex flex-col justify-center items-center gap-5 overflow-hidden">
                  <div
                    onClick={() => navigate(ROUTES.PAYMENT_METHOD)}
                    className="absolute left-4 top-4 border bg-[#D3F4BD] p-1 rounded-md w-10 h-10 flex justify-center items-center"
                  >
                    <img
                      src={ArrowRight}
                      className="w-6 h-6 rotate-180"
                      alt=""
                    />
                  </div>
                  <div className="self-stretch inline-flex justify-center items-center">
                    <div className="flex-1 self-stretch flex justify-center items-center">
                      <div className="justify-center text-xl font-semibold">
                        QR Code
                      </div>
                    </div>
                  </div>
                  <div className="w-48 h-48 rounded-2xl  flex flex-col justify-center items-center  overflow-hidden">
                    <img src={QRCodeImg} alt="" />
                  </div>
                  <div className="justify-center text-sm font-medium leading-tight">
                    Scan and Try Now
                  </div>
                </div>
              </div>
            </ContentLayout>
            <Footer />
          </LayoutContainer>
        </PageLayout>
      </div>
    </div>
  );
}
