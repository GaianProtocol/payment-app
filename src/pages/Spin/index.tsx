import { Header } from "@/components";
import Footer from "@/components/Footer";
import ContentLayout from "@/layouts/ContentLayout";
import LayoutContainer from "@/layouts/LayoutContainer";
import PageLayout from "@/layouts/PageLayout";
import { SpinComponent } from "./SpinComponent";

export default function Spin() {
  return (
    <PageLayout>
      <LayoutContainer>
        <Header />
        <ContentLayout>
          <SpinComponent />
        </ContentLayout>
        <Footer />
      </LayoutContainer>
    </PageLayout>
  );
}
