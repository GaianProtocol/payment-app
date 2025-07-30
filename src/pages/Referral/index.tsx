import { Header } from "@/components";
import Footer from "@/components/Footer";
import ContentLayout from "@/layouts/ContentLayout";
import LayoutContainer from "@/layouts/LayoutContainer";
import PageLayout from "@/layouts/PageLayout";
import { ReferralComponent } from "./ReferralComponent";

export default function Referral() {
  return (
    <PageLayout>
      <LayoutContainer>
        <Header />
        <ContentLayout>
          <ReferralComponent />
        </ContentLayout>
        <Footer />
      </LayoutContainer>
    </PageLayout>
  );
}
