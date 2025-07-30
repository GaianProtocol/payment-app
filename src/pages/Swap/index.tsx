import { Header } from "@/components";
import Footer from "@/components/Footer";
import ContentLayout from "@/layouts/ContentLayout";
import LayoutContainer from "@/layouts/LayoutContainer";
import PageLayout from "@/layouts/PageLayout";
import { TabContainer } from "../Mint/TabContainer";

export default function SwapPage() {
  return (
    <PageLayout>
      <LayoutContainer>
        <Header />
        <ContentLayout>
          <TabContainer />
        </ContentLayout>
        <Footer />
      </LayoutContainer>
    </PageLayout>
  );
}
