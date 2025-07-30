import { Header } from "@/components";
import Footer from "@/components/Footer";
import { InvitePopup } from "@/components/Invite";
import ContentLayout from "@/layouts/ContentLayout";
import LayoutContainer from "@/layouts/LayoutContainer";
import PageLayout from "@/layouts/PageLayout";
import { ROUTES } from "@/routes/paths.route";
import { cn } from "@/utils/cn";
import { FOOTER_HEIGHT, HEADER_HEIGHT } from "@/utils/constant";
import { useNavigate } from "react-router-dom";

export const Invite = () => {
  const navigator = useNavigate();

  return (
    <PageLayout>
      <LayoutContainer>
        <Header />
        <ContentLayout>
          <div
            className={cn(
              "bg-transparent max-w-[674px] !h-max w-full flex max-sm:justify-center mx-auto flex-col gap-4 px-2.5 md:px-[30px] py-16"
            )}
            style={{
              minHeight: `calc(100svh - ${FOOTER_HEIGHT + HEADER_HEIGHT}px)`,
            }}
          >
            <InvitePopup
              onSuccess={() => navigator(ROUTES.DASHBOARD)}
              defaultOpen={true}
            />
          </div>
        </ContentLayout>
        <Footer />
      </LayoutContainer>
    </PageLayout>
  );
};
