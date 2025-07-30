import { Header } from "@/components";
import Footer from "@/components/Footer";
import ContentLayout from "@/layouts/ContentLayout";
import LayoutContainer from "@/layouts/LayoutContainer";
import PageLayout from "@/layouts/PageLayout";
import InstallProvider from "@/providers/InstallProvider";
import { MarketComponent } from "./MarketComponent";

export default function Market() {
  return (
    <PageLayout>
      <InstallProvider>
        <LayoutContainer>
          <Header />
          <ContentLayout>
            <MarketComponent />
          </ContentLayout>
          <Footer />
          {/* <FloatIcon onClick={() => navigate(ROUTES.SPIN)} /> */}
        </LayoutContainer>
      </InstallProvider>
    </PageLayout>
  );
}
